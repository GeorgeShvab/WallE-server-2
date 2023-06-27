import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User, UserSchema } from 'src/schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import AuthService from 'src/auth/auth.service'
import { Token, TokenSchema } from 'src/schemas/token.schema'
import { MailService } from 'src/mail/mail.service'
import UserConstraint from '../dto/user.validations'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({}),
  ],
  providers: [UsersService, AuthService, MailService, ...UserConstraint],
  controllers: [UsersController],
})
export class UsersModule {}
