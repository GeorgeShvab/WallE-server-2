import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDto } from 'src/dto/user.dto'
import { User } from 'src/schemas/user.schema'
import bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(user: UserDto) {
    return this.userModel.create({ ...user, password: await this.hashPassword(user.password) })
  }

  async findOneByEmail(email: string, options?: { activated: boolean }) {
    return this.userModel.findOne({ email, ...(options ? options : {}) })
  }

  async findOneById(_id: string, options?: { activated: boolean }) {
    return this.userModel.findOne({ _id, ...(options ? options : {}) })
  }

  async findOneByUserName(email: string, options?: { activated: boolean }) {
    return this.userModel.findOne({ email, ...(options ? options : {}) })
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
