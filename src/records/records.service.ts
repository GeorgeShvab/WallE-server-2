import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Record } from 'src/schemas/record.schema'
import { RecordCreationDto } from './dao/creation.dto'

interface RecordParam {
  user: string
  document: string
  text: string
  title: string
  description: string
  markdown: string
}

@Injectable()
export class RecordsService {
  constructor(@InjectModel(Record.name) private readonly recordsModel: Model<Record>) {}

  async add(param: RecordCreationDto) {
    return await this.recordsModel.create(param)
  }

  async getByDocument(document: string) {
    return await this.recordsModel.find({ document }).sort('-createdAt')
  }

  async getByUser(document: string, user: string) {
    return await this.recordsModel.find({ user, document }).sort('-createdAt')
  }

  async delete(_id: string) {
    await this.recordsModel.deleteOne({ _id })
  }

  async findOneById(_id: string) {
    return await this.recordsModel.findOne({ _id })
  }
}
