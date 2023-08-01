import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Save, SaveSchema } from 'src/schemas/save.schema'
import { SavesService } from './saves.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Save.name, schema: SaveSchema }])],
  providers: [SavesService],
  controllers: [],
})
export class SavesModule {}
