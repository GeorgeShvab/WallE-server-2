import { IsOptional } from 'class-validator'
import { IsObjectId } from './document-param.dto'

export class RelocationDto {
  @IsOptional()
  @IsObjectId({ message: 'Невірний формат значення' })
  folder: string
}
