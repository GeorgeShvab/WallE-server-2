import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { IsUserNameTaken } from './decorators'

export class DataUpdationDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "Ім'я користувача повинно містити принанні 2 символи" })
  @MaxLength(30, { message: "Ім'я користувача повинно містити не більше 30 символів" })
  name: string

  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Нікнейм повинен містити принанні 2 символи' })
  @MaxLength(30, { message: 'Нікнейм повинен містити не більше 30 символів' })
  @IsUserNameTaken({ message: 'Користувач з таким нікнеймом вже зареєстрований' })
  userName: string
}
