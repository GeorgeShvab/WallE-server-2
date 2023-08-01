import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Holder } from 'src/schemas/holder.schema'

@Injectable()
export class HoldersService {
  constructor(@InjectModel(Holder.name) private readonly holderModel: Model<Holder>) {}

  async create(owner: string) {
    await this.holderModel.create({ owner })
  }

  async addDoc(owner: string, document: string) {
    await this.holderModel.updateOne({ owner }, { $push: { documents: { $each: [document], $position: 0 } } })
  }

  async removeDoc(owner: string | Types.ObjectId, document: string) {
    await this.holderModel.updateOne({ owner }, { $pull: { documents: document } })
  }

  async findDocumentsByUser(owner: string) {
    return (
      (
        await this.holderModel
          .findOne({ owner })
          .populate({
            path: 'documents',
            populate: [
              {
                path: 'saved',
                match: {
                  user: owner,
                },
              },
              {
                path: 'bookmarked',
                match: {
                  user: owner,
                },
              },
            ],
          })
          .sort('-createdAt')
      )?.documents || []
    )
  }
}
