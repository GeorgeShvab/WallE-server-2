import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type AccessDocument = HydratedDocument<Access>

@Schema({ timestamps: true, versionKey: false })
export class Access {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'User' })
  user: ObjectId

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'Document' })
  document: ObjectId

  @Prop({ type: String, required: true, default: 'read' })
  type: 'write' | 'read'
}

export const AccessSchema = SchemaFactory.createForClass(Access)
