import { IsString, MaxLength, MinLength, IsOptional } from 'class-validator'

export class FolderCreationDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Назва папки повинна містити принанні 1 символ' })
  @MaxLength(30, { message: 'Назва папки повинна містити не більше 30 символів' })
  title: string
}
