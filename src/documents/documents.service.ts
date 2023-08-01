import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Document } from 'src/schemas/document.schema'
import { DocumentCreationDto } from './dto/creation.dto'
import { DocumentUpdationDto } from './dto/updation.dto'

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Document.name) private readonly documentModel: Model<Document>) {}

  async create(doc: DocumentCreationDto & { owner: string }) {
    return await this.documentModel.create(doc)
  }

  async update(doc: DocumentUpdationDto & { _id: string }) {
    return await this.documentModel.findOneAndUpdate({ _id: doc._id }, doc, { returnOriginal: false })
  }

  async delete(_id: string) {
    return await this.documentModel.deleteOne({ _id })
  }

  async findOneById(_id: string, user?: string) {
    if (user) {
      return await this.documentModel.findOne({ _id }).populate([
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
      ])
    }

    return await this.documentModel.findOne({ _id })
  }

  async findManyByUser(user: string) {
    return await this.documentModel
      .find({ owner: user })
      .populate([
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
      ])
      .sort('-createdAt')
  }
}
