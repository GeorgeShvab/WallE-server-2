import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDto } from 'src/users/dto/creation.dto'
import { User } from 'src/schemas/user.schema'
import bcrypt from 'bcrypt'

interface Options {
  activated?: boolean
  excludeId?: string
}

const defaultOptions = {
  activated: true,
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: UserDto) {
    return this.userModel.create({ ...user, password: await this.hashPassword(user.password) })
  }

  async findOneByEmail(email: string, options: Options = defaultOptions) {
    return this.userModel.findOne({
      $and: [{ email, activated: options.activated }, options.excludeId ? { _id: { $ne: options.excludeId } } : {}],
    })
  }

  async findOneById(_id: string, options: Options = defaultOptions) {
    return this.userModel.findOne({
      $and: [{ _id, activated: options.activated }, options.excludeId ? { _id: { $ne: options.excludeId } } : {}],
    })
  }

  async findOneByUserName(userName: string, options: Options = defaultOptions) {
    return this.userModel.findOne({
      $and: [{ userName, activated: options.activated }, options.excludeId ? { _id: { $ne: options.excludeId } } : {}],
    })
  }

  async updateOneById(_id: string, param: Partial<User>) {
    return await this.userModel.updateOne({ _id }, param)
  }

  async updatePasswordById(_id: string, password: string) {
    return await this.userModel.updateOne({ _id }, { password: await this.hashPassword(password) })
  }

  async updatePasswordByEmail(email: string, password: string) {
    return await this.userModel.updateOne({ email }, { password: await this.hashPassword(password) })
  }

  async activateUser(_id: string) {
    await this.userModel.updateOne({ _id }, { activated: true })
  }

  async comparePasswords(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword)
  }

  private async hashPassword(password: string) {
    const salt = await bcrypt.genSalt()

    return await bcrypt.hash(password, salt)
  }
}
