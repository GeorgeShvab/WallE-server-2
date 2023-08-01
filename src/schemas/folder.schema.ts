import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type FolderDocument = HydratedDocument<Folder>

@Schema({ timestamps: true, versionKey: false })
export class Folder {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  owner: ObjectId

  @Prop({ type: String, default: 'Нова папка' })
  title: string

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'Document' })
  documents: ObjectId[]
}

export const FolderSchema = SchemaFactory.createForClass(Folder)

FolderSchema.set('toJSON', {
  virtuals: true,
  transform: (document: FolderDocument, ret: Folder & { _id: string }) => {
    const { _id, ...folder } = ret

    return folder
  },
})

FolderSchema.set('toObject', {
  virtuals: true,
  transform: (document: FolderDocument, ret: Folder & { _id: string }) => {
    const { _id, ...folder } = ret

    return folder
  },
})
