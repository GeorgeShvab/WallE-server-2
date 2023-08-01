import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type DocumentDocument = HydratedDocument<Document>

@Schema({ timestamps: true, versionKey: false })
export class Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  owner: ObjectId

  @Prop({ type: String, default: 'Новий документ' })
  title: string

  @Prop({ type: String, default: null })
  description: string

  @Prop({ type: String, default: '' })
  text: string

  @Prop({ type: String, default: '' })
  markdown: string

  @Prop({ type: String, default: 'public' })
  access: 'public' | 'private' | 'restricted' | 'partly-restricted'
}

export const DocumentSchema = SchemaFactory.createForClass(Document)

DocumentSchema.virtual('saved', {
  localField: '_id',
  foreignField: 'document',
  ref: 'Save',
  justOne: true,
})

DocumentSchema.virtual('bookmarked', {
  localField: '_id',
  foreignField: 'document',
  ref: 'Bookmark',
  justOne: true,
})

DocumentSchema.set('toJSON', {
  virtuals: true,
  transform: (document: DocumentDocument, ret: Document & { _id: string }) => {
    const { _id, ...doc } = ret

    return {
      ...doc,
      saved: !!(doc as Document & { saved: any }).saved,
      bookmarked: !!(doc as Document & { bookmarked: any }).bookmarked,
    }
  },
})

DocumentSchema.set('toObject', {
  virtuals: true,
  transform: (document: DocumentDocument, ret: Document & { _id: string }) => {
    const { _id, ...doc } = ret

    return {
      ...doc,
      saved: !!(doc as Document & { saved: any }).saved,
      bookmarked: !!(doc as Document & { bookmarked: any }).bookmarked,
    }
  },
})
