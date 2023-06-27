import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type SaveDocument = HydratedDocument<Save>

@Schema({ timestamps: true, versionKey: false })
export class Save {
  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'User' })
  user: ObjectId

  @Prop({ type: mongoose.Types.ObjectId, required: true, ref: 'Document' })
  document: ObjectId
}

export const SaveSchema = SchemaFactory.createForClass(Save)
