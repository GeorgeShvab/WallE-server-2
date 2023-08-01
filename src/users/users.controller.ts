import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { MailService } from 'src/mail/mail.service'
import { UsersService } from './users.service'
import { UserDto } from 'src/users/dto/creation.dto'
import { JwtService } from '@nestjs/jwt'
import AuthService from 'src/auth/auth.service'
import { UserLoginDto } from 'src/users/dto/login.dto'
import { JwtAuth, JwtAuthGuard } from 'src/auth/auth.guard'
import { DataUpdationDto } from './dto/data-updation.dto'
import { UpdatePasswordDto } from './dto/password-updation.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { User } from 'src/decorators/user'
import { JwtPayload } from 'src/types'
import { PasswordResetDto, RequestPasswordResetDto } from './dto/password-reset.dto'
import { CheckUserNameDto } from './dto/check-username.dto'
import { TokenExpiredError, JsonWebTokenError } from 'jsonwebtoken'
import { HoldersService } from 'src/holder/holders.service'

@Controller()
export class UsersController {
  constructor(
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly holdersService: HoldersService
  ) {}

  @Post('registration')
  async registration(@Body() body: UserDto) {
    const user = await this.usersService.create(body)

    const token = await this.signEmailConfirmationToken(String(user._id))

    await Promise.all([
      this.mailService.sendConfirmationMail(user, token),
      this.holdersService.create(String(user._id)),
    ])

    return {}
  }

  @Post('login')
  async login(@Body() { email, password }: UserLoginDto) {
    const user = await this.authService.validateUser(email, password)

    if (!user) {
      throw new BadRequestException({ email: 'Невірний емейл або пароль', password: 'Невірний емейл або пароль' })
    }

    return { ...(await this.authService.login(user)), user }
  }

  @HttpCode(200)
  @Post('registration/confirmation')
  async registrationConfirmation(@Query() { token }: { token: string }) {
    try {
      const { id } = await this.verifyEmailConfirmationToken(token)
      await this.usersService.activateUser(id)

      const user = await this.usersService.findOneById(id)

      return { ...(await this.authService.login(user)), user }
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new BadRequestException('Час дії посилання сплив')

      throw new BadRequestException('Посилання некоректне')
    }
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@User() { _id }: JwtPayload) {
    const user = await this.usersService.findOneById(_id)

    if (!user) throw new NotFoundException('Користувача не знайдено')

    return user
  }

  @Get('user/:id')
  @UseGuards(JwtAuth)
  async getUser(@Param() { id }: { id: string }) {
    const user = await this.usersService.findOneById(id)

    if (!user) throw new NotFoundException('Користувача не знайдено')

    return user
  }

  @Post('registration/check/username')
  async checkUserName(@Body() body: CheckUserNameDto) {}

  @Patch('user/update/data')
  @UseGuards(JwtAuthGuard)
  async updateUserData(@Body() body: DataUpdationDto, @User() { _id }: JwtPayload) {
    await this.usersService.updateOneById(_id, body)
  }

  @Patch('user/update/password')
  @UseGuards(JwtAuthGuard)
  async updateUserPassword(@Body() { password, oldPassword }: UpdatePasswordDto, @User() { _id }: JwtPayload) {
    const user = await this.usersService.findOneById(_id)

    if (!(await this.usersService.comparePasswords(oldPassword, user.password))) throw new UnauthorizedException()

    await this.usersService.updatePasswordById(_id, password)
  }

  @Patch('user/update/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateUserAvatar(
    @User() user: JwtPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /jpg|jpeg|png/,
        })
        .addMaxSizeValidator({
          maxSize: 1024 * 1024 * 20,
        })
        .build({ fileIsRequired: false })
    )
    file: Express.Multer.File
  ) {
    await this.usersService.updateOneById(user._id, {
      avatar: file ? `${process.env.SERVER_ADDRESS}/static/uploads/${file.filename}` : null,
    })

    if (file) {
      return {
        avatar: `${process.env.SERVER_ADDRESS}/static/uploads/${file.filename}`,
      }
    }
  }

  @Post('user/reset-password/request')
  async requestResetPassword(@Body() { email }: RequestPasswordResetDto) {
    const token = await this.signPasswordResetToken(email)

    const user = await this.usersService.findOneByEmail(email)

    if (!user) throw new BadRequestException('Користувача не знайдено')

    await this.mailService.sendPasswordResetMail(email, token)
  }

  @Post('user/reset-password')
  async resetPassword(@Body() { token, password }: PasswordResetDto) {
    try {
      const { email } = await this.verifyPasswordResetToken(token)

      await this.usersService.updatePasswordByEmail(email, password)

      const user = await this.usersService.findOneByEmail(email)

      if (!user) throw new BadRequestException('Користувача не знайдено')

      return await this.authService.login(user)
    } catch (e: any) {
      if (e instanceof TokenExpiredError) throw new BadRequestException('Час дії посилання сплив')
      if (e instanceof JsonWebTokenError) throw new BadRequestException('Посилання некоректне')

      throw e
    }
  }

  private async signPasswordResetToken(email: string) {
    return await this.jwtService.signAsync(
      { email: email },
      { secret: process.env.JWT_PASSWORD_RESET_SECRET, expiresIn: '30m' }
    )
  }

  private async verifyPasswordResetToken(token: string) {
    return await this.jwtService.verifyAsync<{ email: string }>(token, {
      secret: process.env.JWT_PASSWORD_RESET_SECRET,
    })
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
