import {
  Controller,
  HttpCode,
  Post,
  Headers,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
  Body,
} from '@nestjs/common'
import AuthService from './auth.service'
import { JwtAuthGuard } from './auth.guard'
import { User } from 'src/decorators/user'
import { JwtPayload } from 'src/types'
import { UsersService } from 'src/users/users.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) {}

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Headers('refresh_token') token: string) {
    try {
      const data = await this.authService.verifyRefreshToken(token)

      return this.authService.login(data)
    } catch {
      throw new UnauthorizedException()
    }
  }

  @Post('signout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async signout(@User() user: JwtPayload, @Headers('refresh_token') token: string) {
    if (!token) throw new BadRequestException()

    await this.authService.signout(user._id, token)
  }

  @Post('google')
  async googleOauth(@Body() { access_token }: { access_token: string }) {
    const data = await this.authService.getGoogleUserData(access_token).catch((e) => {
      throw new BadRequestException()
    })

    const user = await this.usersService.findOneByEmail(data.email)

    if (user) {
      return { user: user, ...(await this.authService.login(user)) }
    } else {
      const user = await this.usersService.createUserWithGoogle({
        name: data.name,
        userName: data.email,
        email: data.email,
        avatar: data.picture,
      })

      return { user: user, ...(await this.authService.login(user)) }
    }
  }
}
