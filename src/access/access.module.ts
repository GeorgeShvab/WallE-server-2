import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Access, AccessSchema } from 'src/schemas/access.schema'
import { AccessService } from './access.service'
import { AccessController } from './access.controller'
import { UsersService } from 'src/users/users.service'
import { UserSchema, User } from 'src/schemas/user.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Access.name, schema: AccessSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [AccessService, UsersService],
  controllers: [AccessController],
})
export class AccessModule {}
