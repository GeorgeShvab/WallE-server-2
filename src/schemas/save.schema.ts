import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type SaveDocument = HydratedDocument<Save>

@Schema({ timestamps: true, versionKey: false })
export class Save {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Document' })
  document: ObjectId
}

export const SaveSchema = SchemaFactory.createForClass(Save)

SaveSchema.set('toJSON', {
  virtuals: true,
  transform: (document: SaveDocument, ret: Save & { _id: string }) => {
    const { _id, ...save } = ret

    return save
  },
})

SaveSchema.set('toObject', {
  virtuals: true,
  transform: (document: SaveDocument, ret: Save & { _id: string }) => {
    const { _id, ...save } = ret

    return save
  },
})
