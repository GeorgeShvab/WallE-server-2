import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { ObjectId } from 'mongoose'

@Schema({ timestamps: true, versionKey: false })
export class Contact {
  @Prop({ type: mongoose.Types.ObjectId })
  user: ObjectId

  @Prop({ type: mongoose.Types.ObjectId })
  contact: ObjectId
}

export const ContactSchema = SchemaFactory.createForClass(Contact)
