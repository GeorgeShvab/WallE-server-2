import { Controller, HttpCode, Post, Headers, UnauthorizedException } from '@nestjs/common'
import AuthService from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
}
