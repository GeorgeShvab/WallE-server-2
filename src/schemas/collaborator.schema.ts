import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type CollaboratorDocument = HydratedDocument<Collaborator>

@Schema({ timestamps: true, versionKey: false })
export class Collaborator {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  collaborator: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Document' })
  document: string
}

export const CollaboratorSchema = SchemaFactory.createForClass(Collaborator)

CollaboratorSchema.set('toJSON', {
  virtuals: true,
  transform: (document: CollaboratorDocument, ret: Collaborator & { _id: string }) => {
    const { _id, ...collaborator } = ret

    return collaborator
  },
})

CollaboratorSchema.set('toObject', {
  virtuals: true,
  transform: (document: CollaboratorDocument, ret: Collaborator & { _id: string }) => {
    const { _id, ...collaborator } = ret

    return collaborator
  },
})
