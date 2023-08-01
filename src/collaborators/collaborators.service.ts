import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Collaborator, CollaboratorDocument } from 'src/schemas/collaborator.schema'

@Injectable()
export class CollaboratorsService {
  constructor(@InjectModel(Collaborator.name) private readonly collaboratorModel: Model<Collaborator>) {}

  async add(collaborator: string, document: string) {
    const previous = await this.collaboratorModel.findOne({ document, collaborator })

    if (previous) return previous

    return await this.collaboratorModel.create({ collaborator, document })
  }

  async remove(collaborator: string, document: string) {
    await this.collaboratorModel.deleteOne({ collaborator, document })
  }

  async findMany(document: string, options: { populate: boolean } = { populate: true }) {
    if (options.populate) {
      return (await this.collaboratorModel.find({ document }).populate('collaborator')).map(
        (item: any) => item.collaborator as CollaboratorDocument
      ) as CollaboratorDocument[]
    } else {
      return await this.collaboratorModel.find({ document })
    }
  }
}
