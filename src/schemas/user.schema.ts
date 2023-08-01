import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, versionKey: false, virtuals: true })
export class User {
  @Prop({ type: String, required: true })
  name: string

  @Prop({ type: String, required: true })
  userName: string

  @Prop({ type: String, required: true })
  email: string

  @Prop({ type: String, default: null })
  password: string

  @Prop({ type: String, default: null })
  avatar: string | null

  @Prop({ type: Boolean, default: false })
  activated: boolean

  @Prop({ type: Boolean, default: false })
  createdWithGoogle: boolean

  @Prop({ type: String, default: 'light' })
  mode: 'light' | 'dark'
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.set('toJSON', {
  virtuals: true,
  transform: (document: UserDocument, ret: User & { _id: string }) => {
    const { password, _id, ...user } = ret

    return user
  },
})

UserSchema.set('toObject', {
  virtuals: true,
  transform: (document: UserDocument, ret: User & { _id: string }) => {
    const { password, _id, ...user } = ret

    return user
  },
})
