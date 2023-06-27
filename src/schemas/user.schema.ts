import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  userName: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: String, required: true })
  password: string

  @Prop({ type: String, default: null })
  avatar: string | null

  @Prop({ type: Boolean, default: false })
  activated: boolean

  @Prop({ type: String, default: 'light' })
  mode: 'light' | 'dark'
}

export const UserSchema = SchemaFactory.createForClass(User)
