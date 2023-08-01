import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type RecordDocument = HydratedDocument<Record>

@Schema({ timestamps: true, versionKey: false })
export class Record {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Document' })
  document: ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, req: true, ref: 'User' })
  user: ObjectId

  @Prop({ type: String, required: true })
  title: string

  @Prop({ type: String, default: '' })
  description: string

  @Prop({ type: String, default: '' })
  text: string

  @Prop({ type: String, default: '' })
  markdown: string

  @Prop({ type: String, default: 'public' })
  access: 'public' | 'private' | 'restricted' | 'partly-restricted'
}

export const RecordSchema = SchemaFactory.createForClass(Record)

RecordSchema.set('toJSON', {
  virtuals: true,
  transform: (document: RecordDocument, ret: Record & { _id: string }) => {
    const { _id, ...record } = ret

    return record
  },
})

RecordSchema.set('toObject', {
  virtuals: true,
  transform: (document: RecordDocument, ret: Record & { _id: string }) => {
    const { _id, ...record } = ret

    return record
  },
})
