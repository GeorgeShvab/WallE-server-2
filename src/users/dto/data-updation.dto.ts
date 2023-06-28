import { IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator'
import { IsUserNameTaken } from './decorators'

export class DataUpdationDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Ім'я користувача повинно містити принанні 2 символи" })
  @MaxLength(30, { message: "Ім'я користувача повинно містити не більше 30 символів" })
  name: string
}
