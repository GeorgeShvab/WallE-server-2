import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type RecordDocument = HydratedDocument<Record>

@Schema({ timestamps: true, versionKey: false })
export class Record {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'Document' })
  document: ObjectId

  @Prop({ type: mongoose.Types.ObjectId, req: true, ref: 'User' })
  user: ObjectId

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, required: true })
  description: string

  @Prop({ type: String, required: true })
  text: string
}

export const RecordSchema = SchemaFactory.createForClass(Record)
