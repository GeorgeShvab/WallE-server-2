import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { Token, TokenSchema } from 'src/schemas/token.schema'
import { User, UserSchema } from 'src/schemas/user.schema'
import { UsersService } from 'src/users/users.service'
import { JwtModule } from '@nestjs/jwt'
import AuthService from './auth.service'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './jwt.strategy'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({}),
    PassportModule,
  ],
  providers: [UsersService, JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
