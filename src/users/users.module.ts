import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { User, UserSchema } from 'src/schemas/user.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule } from '@nestjs/jwt'
import AuthService from 'src/auth/auth.service'
import { Token, TokenSchema } from 'src/schemas/token.schema'
import { MailService } from 'src/mail/mail.service'
import UserConstraint from './dto/decorators'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import path from 'path'
import fs from 'fs'
import { generateId } from 'src/utils/generateId'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.register({}),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          console.log(path.join(__dirname, '..', '..', 'uploads'))
          if (!fs.existsSync(path.join(__dirname, '..', '..', 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', 'uploads'))
          }

          cb(null, path.join(__dirname, '..', '..', 'uploads'))
        },
        filename: (req, file, cb) => {
          const name = `${generateId()}.${file.originalname.split('.').reverse()[0]}`

          cb(null, name)
        },
      }),
    }),
  ],
  providers: [UsersService, AuthService, MailService, ...UserConstraint],
  controllers: [UsersController],
})
export class UsersModule {}
