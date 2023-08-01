import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { IsValidAccessType } from './custom-decorators'

export class DocumentCreationDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Назва документа повинна містити принанні один символ' })
  @MaxLength(30, { message: 'Назва документа повинна містити не більше 30 символів' })
  title: string

  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Опис документа повинна містити принанні один символ' })
  @MaxLength(100, { message: 'Опис документа повинна містити не більше 100 символів' })
  description: string

  @IsOptional()
  @IsString()
  @IsValidAccessType({ message: 'Невірний тип доступу' })
  access: 'private' | 'public' | 'restricted' | 'partly-restricted'
}
