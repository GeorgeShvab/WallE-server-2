import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type AccessDocument = HydratedDocument<Access>

@Schema({ timestamps: true, versionKey: false })
export class Access {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Document' })
  document: ObjectId

  @Prop({ type: String, required: true, default: 'read' })
  type: 'write' | 'read'
}

export const AccessSchema = SchemaFactory.createForClass(Access)

AccessSchema.set('toJSON', {
  virtuals: true,
  transform: (document: AccessDocument, ret: Access & { _id: string }) => {
    const { _id, ...access } = ret

    return access
  },
})

AccessSchema.set('toObject', {
  virtuals: true,
  transform: (document: AccessDocument, ret: Access & { _id: string }) => {
    const { _id, ...access } = ret

    return access
  },
})
