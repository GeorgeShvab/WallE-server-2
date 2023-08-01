import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Access } from 'src/schemas/access.schema'
import { ProvideAccessDto } from './dto/provide.dto'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class AccessService {
  constructor(
    @InjectModel(Access.name) private readonly accessModel: Model<Access>,
    private readonly usersService: UsersService
  ) {}

  async provide(arg: ProvideAccessDto) {
    const user = await this.usersService.findOneByEmail(arg.email)

    await this.accessModel.create({ document: arg.document, type: arg.access, user: user._id })
  }

  async remove(_id: string) {
    await this.accessModel.deleteOne({ _id })
  }

  async hasAccess(document: string, user: string) {
    return Boolean(await this.accessModel.findOne({ document, user }))
  }
}
