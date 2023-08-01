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
import { FoldersService } from './folders.service'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { FolderCreationDto } from './dto/creation.dto'
import { JwtPayload } from 'src/types'
import { User } from 'src/decorators/user'
import { IdParamDto } from 'src/documents/dto/document-param.dto'
import { AddDocumentDto } from './dto/add-doc.dto'
import { DocumentsService } from 'src/documents/documents.service'
import { HoldersService } from 'src/holder/holders.service'

@Controller()
export class FoldersController {
  constructor(
    private readonly foldersService: FoldersService,
    private readonly documentsService: DocumentsService,
    private readonly holdersService: HoldersService
  ) {}

  @Get('folders')
  @UseGuards(JwtAuthGuard)
  async getMany(@User() { _id }: JwtPayload) {
    return await this.foldersService.getManyByUser(_id)
  }

  @Get('folder/:id')
  @UseGuards(JwtAuthGuard)
  async getOne(@Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const folder = await this.foldersService.getOne(id)

    if (folder.owner.toString() !== user._id) throw new ForbiddenException()
    return await this.foldersService.getOne(id)
  }

  @Post('folder')
  @UseGuards(JwtAuthGuard)
  async create(@Body() body: FolderCreationDto, @User() user: JwtPayload) {
    return await this.foldersService.create({ ...body, owner: user._id })
  }

  @Delete('folder/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const folder = await this.foldersService.getOne(id)

    if (folder.owner.toString() !== user._id) throw new ForbiddenException()

    await this.foldersService.delete(id)
  }

  @Patch('folder/:id')
  @UseGuards(JwtAuthGuard)
  async update(@Body() { title }: FolderCreationDto, @Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const folder = await this.foldersService.getOne(id)

    if (folder.owner.toString() !== user._id) throw new ForbiddenException()

    await this.foldersService.update({ _id: id, title })
  }

  @Patch('folder/:id/add')
  @UseGuards(JwtAuthGuard)
  async addDoc(@Body() { document }: AddDocumentDto, @Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const [doc, folder, folderWithDoc] = await Promise.all([
      this.documentsService.findOneById(document),
      this.foldersService.getOne(id, { populate: false }),
      this.foldersService.findFolderWithDoc(user._id, document),
    ])

    if (!doc) throw new NotFoundException()

    if (folder.owner.toString() !== user._id) throw new ForbiddenException()

    if (folder.documents.find((item) => item.toString() === document)) {
      throw new BadRequestException()
    }

    await Promise.all([
      this.foldersService.addDoc(id, document),
      folderWithDoc ? this.foldersService.removeDoc(folderWithDoc._id, document) : null,
      this.holdersService.removeDoc(user._id, document),
    ])
  }

  @Patch('folder/:id/remove')
  @UseGuards(JwtAuthGuard)
  async removeDoc(@Body() { document }: AddDocumentDto, @Param() { id }: IdParamDto, @User() user: JwtPayload) {
    const folder = await this.foldersService.getOne(id)

    if (folder.owner.toString() !== user._id) throw new ForbiddenException()

    await this.foldersService.removeDoc(id, document)
  }
}
