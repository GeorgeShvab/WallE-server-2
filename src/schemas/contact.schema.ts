import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type ContactDocument = HydratedDocument<Contact>

@Schema({ timestamps: true, versionKey: false })
export class Contact {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  user: ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  contact: ObjectId
}

export const ContactSchema = SchemaFactory.createForClass(Contact)

ContactSchema.set('toJSON', {
  virtuals: true,
  transform: (document: ContactDocument, ret: Contact & { _id: string }) => {
    const { _id, ...contact } = ret

    return contact
  },
})

ContactSchema.set('toObject', {
  virtuals: true,
  transform: (document: ContactDocument, ret: Contact & { _id: string }) => {
    const { _id, ...contact } = ret

    return contact
  },
})
