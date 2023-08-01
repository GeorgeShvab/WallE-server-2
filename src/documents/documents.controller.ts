import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { DocumentCreationDto } from './dto/creation.dto'
import { User } from 'src/decorators/user'
import { JwtPayload } from 'src/types'
import { JwtAuth, JwtAuthGuard } from 'src/auth/auth.guard'
import { DocumentUpdationDto } from './dto/updation.dto'
import { MailService } from 'src/mail/mail.service'
import { CollaboratorsService } from 'src/collaborators/collaborators.service'
import { SavesService } from 'src/saves/saves.service'
import { IdAndUserParamDto, IdParamDto } from './dto/document-param.dto'
import { RecordsService } from 'src/records/records.service'
import { RollBackDto } from './dto/roll-back.dto'
import { AccessGuard } from './AccessGuard.dto'
import { FoldersService } from 'src/folders/folders.service'
import { HoldersService } from 'src/holder/holders.service'
import { RelocationDto } from './dto/relocation.dto'
import { InvitationDto } from './dto/invitation.dto'
import { BookmarksService } from 'src/bookmarks/bookmarks.service'

@Controller()
export class DocumentsController {
  constructor(
    private readonly documetsService: DocumentsService,
    private readonly mailService: MailService,
    private readonly collaboratorsService: CollaboratorsService,
    private readonly savesService: SavesService,
    private readonly recordsService: RecordsService,
    private readonly foldersService: FoldersService,
    private readonly holdersService: HoldersService,
    private readonly bookmarksService: BookmarksService
  ) {}

  @Get('documents/saved')
  @UseGuards(JwtAuthGuard)
  async getSaved(@User() user: JwtPayload) {
    return await this.savesService.getSaves(user._id)
  }

  @Get('documents/bookmarks')
  @UseGuards(JwtAuthGuard)
  async getBookmarks(@User() user: JwtPayload) {
    const data = await this.bookmarksService.getByUser(user._id)

    return data
  }

  @Get('documents')
  @UseGuards(JwtAuthGuard)
  async getMy(@User() user: JwtPayload) {
    const documents = await this.holdersService.findDocumentsByUser(user._id)

    return documents
  }

  @Get('document/:id')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async get(@Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const [document, collaborators] = await Promise.all([
      this.documetsService.findOneById(id, user?._id),
      this.collaboratorsService.findMany(id),
    ])

    if (document.access === 'public' || document.owner.toString() === user?._id) {
      return { ...document.toObject(), collaborators }
    }

    throw new ForbiddenException()
  }

  @Get('document/:id/collaborators')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async getCollaborators(@Param() { id }: IdParamDto, @User() user: JwtPayload) {
    return await this.collaboratorsService.findMany(id)
  }

  @Get('document/:id/records')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async getRecords(@Param() { id }: IdParamDto) {
    return await this.recordsService.getByDocument(id)
  }

  @Get('document/:id/records/:user')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async getRecordsByUser(@Param() { id, user }: IdAndUserParamDto) {
    return await this.recordsService.getByUser(id, user)
  }

  @Post('document')
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: DocumentCreationDto, @User() user: JwtPayload) {
    const doc = await this.documetsService.create({ ...body, owner: user._id })

    await Promise.all([
      this.holdersService.addDoc(user._id, doc._id.toString()),
      this.collaboratorsService.add(user._id, doc.id),
    ])

    return doc
  }

  @Patch('document/:id/relocate')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async relocate(@Body() { folder }: RelocationDto, @Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const [doc, folderDoc] = await Promise.all([
      this.documetsService.findOneById(id),
      folder ? this.foldersService.getOne(folder) : null,
    ])

    if (!doc) {
      throw new NotFoundException()
    }

    if (folder && folderDoc?.owner.toString() !== user._id) {
      throw new ForbiddenException()
    }

    await this.foldersService.removeDocFromFolders(id)
    if (folder) {
      await this.holdersService.removeDoc(user._id, id)
      await this.foldersService.addDoc(folder, id)
    } else {
      await this.holdersService.addDoc(user._id, id)
    }
  }

  @Patch('document/:id')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async update(@Body() body: DocumentUpdationDto, @Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const doc = await this.documetsService.findOneById(id)

    if (!doc || user?._id === doc.owner.toString() || doc.access === 'public') {
      const [data] = await Promise.all([
        this.documetsService.update({ ...body, _id: id }),
        this.collaboratorsService.add(user._id, id),
      ])

      await this.recordsService.add({ ...doc.toObject(), ...body, user: user._id, document: id })

      return data
    } else {
      throw new ForbiddenException()
    }
  }

  @Patch('document/:id/rollback')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async rollBack(@Body() { version }: RollBackDto, @Param() { id }: IdParamDto) {
    const versionDoc = await this.recordsService.findOneById(version)

    if (!versionDoc) throw new NotFoundException()

    if (versionDoc.document.toString() !== id) throw new BadRequestException()

    await this.documetsService.update({
      _id: id,
      title: versionDoc.title,
      text: versionDoc.text,
      description: versionDoc.description,
      access: versionDoc.access,
      markdown: versionDoc.markdown,
    })
  }

  @Delete('document/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param() { id }: IdParamDto, @User() { _id }: JwtPayload) {
    const doc = await this.documetsService.findOneById(id)

    if (!doc || doc.owner.toString() !== _id) {
      throw new ForbiddenException()
    }

    await Promise.all([
      this.documetsService.delete(id),
      this.holdersService.removeDoc(_id, id),
      this.foldersService.removeDocFromFolders(id),
      this.savesService.remove(_id, id),
    ])
  }

  @Post('document/:id/invite')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async invite(@Param() { id }: IdParamDto, @Body() { emails }: InvitationDto, @User() user: JwtPayload) {
    const doc = await this.documetsService.findOneById(id)

    if (!doc) throw new NotFoundException()

    await this.mailService.sendCollaborationInvite(emails, user, doc)
  }

  @Post('document/:id/save')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async save(@Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const doc = await this.documetsService.findOneById(id)

    if (!doc) throw new NotFoundException()

    await this.savesService.createIfNotExistsOtherwiseDelete(user._id, id)
  }

  @Post('document/:id/bookmark')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async favorite(@Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const doc = await this.documetsService.findOneById(id)

    if (!doc) throw new NotFoundException()

    await this.bookmarksService.createIfNotExistsOtherwiseDelete(user._id, id)
  }

  @Delete('document/:id/save')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async unsave(@Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const doc = await this.documetsService.findOneById(id)

    if (!doc) throw new NotFoundException()

    await this.savesService.remove(user._id, id)
  }

  @Delete('document/:id/folders')
  @UseGuards(AccessGuard)
  @UseGuards(JwtAuth)
  async removeDocFromFolders(@Param() { id }: IdParamDto, @User() user: JwtPayload) {
    await Promise.all([this.foldersService.removeDocFromFolders(id), this.holdersService.addDoc(user._id, id)])
  }
}
