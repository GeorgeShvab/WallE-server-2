import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type FolderDocument = HydratedDocument<Folder>

@Schema({ timestamps: true, versionKey: false })
export class Folder {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'User' })
  owner: ObjectId

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: [mongoose.Types.ObjectId], required: true })
  documents: ObjectId[]
}

export const FolderSchema = SchemaFactory.createForClass(Folder)
