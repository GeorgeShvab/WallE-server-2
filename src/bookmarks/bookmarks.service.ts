import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Bookmark } from 'src/schemas/bookmark.schema'

@Injectable()
export class BookmarksService {
  constructor(@InjectModel(Bookmark.name) private readonly bookmarkModel: Model<Bookmark>) {}

  async create(user: string, document: string) {
    return await this.bookmarkModel.create({ user, document })
  }

  async createIfNotExists(user: string, document: string) {
    const doc = await this.bookmarkModel.findOne({ user, document })

    if (doc) return doc

    return await this.bookmarkModel.create({ user, document })
  }

  async delete(user: string, document: string) {
    await this.bookmarkModel.deleteOne({ user, document })
  }

  async getByUser(user: string) {
    return (
      await this.bookmarkModel
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

  async createIfNotExistsOtherwiseDelete(user: string, document: string) {
    const deletionData = await this.bookmarkModel.deleteOne({ user, document })

    if (deletionData.deletedCount) return null

    return await this.bookmarkModel.create({ user, document })
  }
}
