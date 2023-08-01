import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Document, DocumentSchema } from 'src/schemas/document.schema'
import { DocumentsService } from './documents.service'
import { DocumentsController } from './documents.controller'
import { MailService } from 'src/mail/mail.service'
import { CollaboratorsService } from 'src/collaborators/collaborators.service'
import { Collaborator, CollaboratorSchema } from 'src/schemas/collaborator.schema'
import { SavesService } from 'src/saves/saves.service'
import { Save, SaveSchema } from 'src/schemas/save.schema'
import { Record, RecordSchema } from 'src/schemas/record.schema'
import { RecordsService } from 'src/records/records.service'
import { AccessService } from 'src/access/access.service'
import { Access, AccessSchema } from 'src/schemas/access.schema'
import { UsersService } from 'src/users/users.service'
import { UserSchema, User } from 'src/schemas/user.schema'
import { FoldersService } from 'src/folders/folders.service'
import { Folder, FolderSchema } from 'src/schemas/folder.schema'
import { Holder, HolderSchema } from 'src/schemas/holder.schema'
import { HoldersService } from 'src/holder/holders.service'
import { Bookmark, BookmarkSchema } from 'src/schemas/bookmark.schema'
import { BookmarksService } from 'src/bookmarks/bookmarks.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
      { name: Collaborator.name, schema: CollaboratorSchema },
      { name: Save.name, schema: SaveSchema },
      { name: Record.name, schema: RecordSchema },
      { name: Access.name, schema: AccessSchema },
      { name: User.name, schema: UserSchema },
      { name: Folder.name, schema: FolderSchema },
      { name: Holder.name, schema: HolderSchema },
      { name: Bookmark.name, schema: BookmarkSchema },
    ]),
  ],
  providers: [
    DocumentsService,
    MailService,
    CollaboratorsService,
    SavesService,
    RecordsService,
    AccessService,
    UsersService,
    FoldersService,
    HoldersService,
    BookmarksService,
  ],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
