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
import { Holder, HolderSchema } from 'src/schemas/holder.schema'
import { HoldersService } from 'src/holder/holders.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Token.name, schema: TokenSchema },
      { name: Holder.name, schema: HolderSchema },
    ]),
    JwtModule.register({}),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          if (!fs.existsSync(path.join(__dirname, '..', '..', 'static'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', 'static'))
          }

          if (!fs.existsSync(path.join(__dirname, '..', '..', 'static', 'uploads'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', 'static', 'uploads'))
          }

          cb(null, path.join(__dirname, '..', '..', 'static', 'uploads'))
        },
        filename: (req, file, cb) => {
          const name = `${generateId()}.${file.originalname.split('.').reverse()[0]}`

          cb(null, name)
        },
      }),
    }),
  ],
  providers: [UsersService, AuthService, MailService, HoldersService, ...UserConstraint],
  controllers: [UsersController],
})
export class UsersModule {}
