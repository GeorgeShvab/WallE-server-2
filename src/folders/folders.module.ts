import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Folder, FolderSchema } from 'src/schemas/folder.schema'
import { FoldersService } from './folders.service'
import { FoldersController } from './folders.controller'
import { DocumentsService } from 'src/documents/documents.service'
import { Document, DocumentSchema } from 'src/schemas/document.schema'
import { HoldersService } from 'src/holder/holders.service'
import { Holder, HolderSchema } from 'src/schemas/holder.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: Document.name, schema: DocumentSchema },
      { name: Holder.name, schema: HolderSchema },
    ]),
  ],
  providers: [FoldersService, DocumentsService, HoldersService],
  controllers: [FoldersController],
})
export class FoldersModule {}
