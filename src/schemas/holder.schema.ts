import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, ObjectId } from 'mongoose'

export type HolderDocument = HydratedDocument<Holder>

@Schema({ timestamps: true, versionKey: false })
export class Holder {
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  owner: ObjectId

  @Prop({ type: [mongoose.Schema.Types.ObjectId], default: [], ref: 'Document' })
  documents: ObjectId[]
}

export const HolderSchema = SchemaFactory.createForClass(Holder)

HolderSchema.set('toJSON', {
  virtuals: true,
  transform: (document: HolderDocument, ret: Holder & { _id: string }) => {
    const { _id, ...holder } = ret

    return holder
  },
})

HolderSchema.set('toObject', {
  virtuals: true,
  transform: (document: HolderDocument, ret: Holder & { _id: string }) => {
    const { _id, ...holder } = ret

    return holder
  },
})
