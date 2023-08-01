import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Folder } from 'src/schemas/folder.schema'

@Injectable()
export class FoldersService {
  constructor(@InjectModel(Folder.name) private readonly folderModel: Model<Folder>) {}

  async create(arg: { owner: string; title: string }) {
    return await this.folderModel.create(arg)
  }

  async delete(_id: string) {
    await this.folderModel.deleteOne({ _id })
  }

  async getOne(_id: string, options: { populate: boolean } = { populate: true }) {
    if (options.populate) {
      return await this.folderModel.findOne({ _id }).populate('documents')
    } else {
      return await this.folderModel.findOne({ _id })
    }
  }

  async getManyByUser(owner: string, options: { populate: boolean } = { populate: true }) {
    if (options.populate) {
      return await this.folderModel
        .find({ owner })
        .populate({
          path: 'documents',
          populate: {
            path: 'saved',
            match: {
              user: owner,
            },
          },
        })
        .sort('-createdAt')
    } else {
      return await this.folderModel.find({ owner }).sort('-createdAt')
    }
  }

  async findFolderWithDoc(user: string, document: string) {
    return await this.folderModel.findOne({ owner: user.toString(), documents: document })
  }

  async update(arg: { title?: string; _id: string }) {
    await this.folderModel.updateOne({ _id: arg._id }, arg)
  }

  async addDoc(_id: string, document: string) {
    await this.folderModel.updateOne({ _id }, { $push: { documents: { $each: [document], $position: 0 } } })
  }

  async removeDoc(_id: string | Types.ObjectId, document: string) {
    await this.folderModel.updateOne({ _id }, { $pull: { documents: document } })
  }

  async removeDocFromFolders(document: string) {
    await this.folderModel.updateMany({ documents: document }, { $pull: { documents: document } })
  }
}
