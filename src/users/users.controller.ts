import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common'
import { MailService } from 'src/mail/mail.service'
import { UsersService } from './users.service'
import { UserDto } from 'src/dto/user.dto'
import { JwtService } from '@nestjs/jwt'
import AuthService from 'src/auth/auth.service'
import { UserLoginDto } from 'src/dto/user-login.dto'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { Request } from 'express'

@Controller()
export class UsersController {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  @Post('registration')
  async registration(@Body() body: UserDto) {
    const user = await this.usersService.create(body)

    const token = await this.signEmailConfirmationToken(String(user._id))

    await this.mailService.sendConfirmationMail(user, token)

    return {}
  }

  @Post('login')
  async login(@Body() { email, password }: UserLoginDto) {
    const user = await this.authService.validateUser(email, password)

    if (!user) throw new BadRequestException()

    return await this.authService.login(user)
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param() { id }: { id: string }, @Req() req: Request) {
    const user = await this.usersService.findOneById(id)

    if (!user) throw new NotFoundException('Користувача не знайдено')

    return user
  }

  @HttpCode(200)
  @Post('registration/confirmation')
  async registrationConfirmation(@Query() { token }: { token: string }) {
    const { id } = await this.verifyEmailConfirmationToken(token).catch(() => {
      throw new BadRequestException('Час дії посилання сплив')
    })

    const [user] = await Promise.all([this.usersService.findOneById(id), this.usersService.activateUser(id)])

    return await this.authService.login(user)
  }

  private async signEmailConfirmationToken(id: string) {
    return await this.jwtService.signAsync(
      { id: id.toString() },
      { secret: process.env.EMAIL_CONFIRMATION_SECRET, expiresIn: '30m' }
    )
  }

  private async verifyEmailConfirmationToken(token: string) {
    return await this.jwtService.verifyAsync<{ id: string }>(token, { secret: process.env.EMAIL_CONFIRMATION_SECRET })
  }
}
