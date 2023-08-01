import { Body, Controller, Delete, Param, Post } from '@nestjs/common'
import { RecordsService } from './records.service'
import { RecordCreationDto } from './dao/creation.dto'
import { IdParamDto } from 'src/documents/dto/document-param.dto'

@Controller('record')
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Delete(':id')
  async delete(@Param() { id }: IdParamDto) {
    await this.recordsService.delete(id)
  }
}
