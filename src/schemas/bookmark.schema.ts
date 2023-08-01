import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type HydratedBookmark = HydratedDocument<Bookmark>

@Schema({ versionKey: false, timestamps: true })
export class Bookmark {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  user: ObjectId

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Document' })
  document: ObjectId
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark)
