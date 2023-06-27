import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Token } from 'src/schemas/token.schema'
import { UsersService } from 'src/users/users.service'

interface JwtPayload {
  _id: string
  name: string
  userName: string
  email: string
  mode: string
}

interface JwtParams {
  _id: Types.ObjectId | string
  name: string
  userName: string
  email: string
  mode: string
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email)

    if (await this.usersService.comparePasswords(password, user.password)) {
      return user
    } else {
      return null
    }
  }

  async login(user: JwtParams) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ])

    await this.tokenModel.create({ user: user._id, token: refreshToken })

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    }
  }

  async verifyRefreshToken(token: string) {
    return await this.jwtService.verifyAsync<JwtPayload>(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    })
  }

  async generateAccessToken(user: JwtParams) {
    const payload = { name: user.name, userName: user.userName, email: user.email, _id: user._id, mode: user.mode }

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '2m',
    })
  }

  async generateRefreshToken(user: JwtParams) {
    const payload = { name: user.name, userName: user.userName, email: user.email, _id: user._id, mode: user.mode }

    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '30d',
    })
  }
}

export default AuthService
