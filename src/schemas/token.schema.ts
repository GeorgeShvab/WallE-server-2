import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type TokenDocument = HydratedDocument<Token>

@Schema({ timestamps: true, versionKey: false })
export class Token {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: ObjectId

  @Prop({ type: String, required: true })
  token: string
}

export const TokenSchema = SchemaFactory.createForClass(Token)

TokenSchema.set('toJSON', {
  virtuals: true,
  transform: (document: TokenDocument, ret: Token & { _id: string }) => {
    const { _id, ...token } = ret

    return token
  },
})

TokenSchema.set('toObject', {
  virtuals: true,
  transform: (document: TokenDocument, ret: Token & { _id: string }) => {
    const { _id, ...token } = ret

    return token
  },
})
