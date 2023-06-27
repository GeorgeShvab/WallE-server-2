import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type DocumentDocument = HydratedDocument<Document>

@Schema({ timestamps: true, versionKey: false })
export class Document {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'User' })
  owner: ObjectId

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: String, required: true })
  text: string

  @Prop({ type: String, required: true })
  markdown: string

  @Prop({ type: String, required: true })
  access: 'public' | 'private' | 'restricted'
}

export const DocumentSchema = SchemaFactory.createForClass(Document)
