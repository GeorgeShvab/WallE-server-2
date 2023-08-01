import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { IsObjectId } from 'src/decorators/isValidObjectId'
import { IsValidAccessType } from 'src/documents/dto/custom-decorators'

export class RecordCreationDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Введіть назву документа' })
  @MinLength(1, { message: 'Назва документа повинна містити принанні один символ' })
  @MaxLength(30, { message: 'Назва документа повинна містити не більше 30 символів' })
  title: string

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Опис документа повинна містити не більше 100 символів' })
  description: string

  @IsOptional()
  @IsString({ message: 'Невірний формат' })
  @IsValidAccessType({ message: 'Невірний тип доступу' })
  access: 'private' | 'public' | 'restricted' | 'partly-restricted'

  @IsOptional()
  @IsString({ message: 'Невірний формат' })
  @MaxLength(20000, { message: 'Документ повинен містити не більше 20000 символів' })
  text: string

  @IsOptional()
  @IsString({ message: 'Невірний формат' })
  @MaxLength(50000, { message: 'Документ повинен містити не більше 20000 символів' })
  markdown: string

  @IsNotEmpty()
  @IsObjectId()
  user: string

  @IsNotEmpty()
  @IsObjectId()
  document: string
}
