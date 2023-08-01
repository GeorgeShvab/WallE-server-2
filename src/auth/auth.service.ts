import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import axios from 'axios'
import { Model, Types } from 'mongoose'
import { Token } from 'src/schemas/token.schema'
import { JwtPayload } from 'src/types'
import { UsersService } from 'src/users/users.service'

interface JwtParams {
  _id: Types.ObjectId | string
  name: string
  userName: string
  email: string
  mode: string
}

interface GoogleResponse {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: true
  locale: string
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email, { activated: true })

    if (!user) return null

    if (await this.usersService.comparePasswords(password, user.password)) {
      return user
    } else {
      return null
    }
  }

  async signout(user: string, token: string) {
    await this.tokenModel.deleteOne({ user, token })
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
    const dbToken = await this.tokenModel.findOne({ token })

    if (!dbToken) throw new UnauthorizedException()

    setTimeout(async () => {
      await this.tokenModel.deleteOne({ token })
    }, 15000)

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

  async getGoogleUserData(token: string) {
    const userInfo: GoogleResponse = await axios
      .get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => res.data)

    return userInfo
  }
}

export default AuthService
