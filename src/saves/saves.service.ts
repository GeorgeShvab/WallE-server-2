import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Save } from 'src/schemas/save.schema'

@Injectable()
export class SavesService {
  constructor(@InjectModel(Save.name) private readonly saveModel: Model<Save>) {}

  async add(user: string, document: string) {
    await this.saveModel.create({ user, document })
  }

  async remove(user: string, document: string) {
    return await this.saveModel.deleteOne({ user, document })
  }

  async getSaves(user: string) {
    return (
      await this.saveModel
        .find({ user })
        .populate({
          path: 'document',
          populate: [
            {
              path: 'saved',
              match: {
                user,
              },
            },
            {
              path: 'bookmarked',
              match: {
                user,
              },
            },
          ],
        })
        .sort('-createdAt')
    ).map((item) => item.document)
  }

  async getSave(user: string, document: string) {
    return (await this.saveModel.findOne({ user, document }).populate('document'))?.document
  }

  async createIfNotExistsOtherwiseDelete(user: string, document: string) {
    const deletionData = await this.saveModel.deleteOne({ user, document })

    if (deletionData.deletedCount) return null

    return await this.saveModel.create({ user, document })
  }
}
