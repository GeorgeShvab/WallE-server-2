import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Holder, HolderSchema } from 'src/schemas/holder.schema'
import { HoldersService } from './holders.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Holder.name, schema: HolderSchema }])],
  providers: [HoldersService],
})
export class HoldersModule {}
