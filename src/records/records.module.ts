import { Module } from '@nestjs/common'
import { RecordsService } from './records.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Record, RecordSchema } from 'src/schemas/record.schema'
import { RecordsController } from './records.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }])],
  providers: [RecordsService],
  controllers: [RecordsController],
})
export class RecordsModule {}
