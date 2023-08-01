import { IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator'
import { IsEmailTaken, IsUserNameTaken } from './decorators'

export class UserDto {
  @IsNotEmpty({ message: 'Заповніть всі поля' })
  @MinLength(2, { message: "Ім'я повинно містити принанні 2 символи" })
  @MaxLength(30, { message: "Ім'я повинно містити не більше 30 символів" })
  name: string

  @IsNotEmpty({ message: 'Заповніть всі поля' })
  @MinLength(2, { message: 'Нікнейм повинен містити принанні 2 символи' })
  @MaxLength(30, { message: 'Нікнейм повинен містити не більше 30 символів' })
  @IsUserNameTaken({ message: 'Користувач з таким нікнеймом вже зареєстрований' })
  @Matches(/^[A-Za-z0-9._-]+$/i, { message: 'Допускаються лише цифри, букви латинського алфавіту, тире та прочерк' })
  userName: string

  @IsNotEmpty({ message: 'Заповніть всі поля' })
  @IsEmail({}, { message: 'Введіть коректний емейл' })
  @IsEmailTaken({ message: 'Користувач з таки емейлом вже зареєстрований' })
  email: string

  @IsNotEmpty({ message: 'Заповніть всі поля' })
  @MinLength(6, { message: 'Пароль повинен містити принанні 6 символів' })
  @MaxLength(100, { message: 'Пароль повинен містити не більше 100 символів' })
  password: string
}
