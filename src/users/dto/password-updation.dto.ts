import { IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class UpdatePasswordDto {
  @IsNotEmpty({ message: 'Невірний старий пароль' })
  @MinLength(6, { message: 'Невірний старий пароль' })
  @MaxLength(100, { message: 'Невірний старий пароль' })
  oldPassword: string

  @IsNotEmpty({ message: 'Введіть пароль' })
  @MinLength(6, { message: 'Пароль повинен містити принанні 6 символів' })
  @MaxLength(100, { message: 'Пароль повинен містити не більше 100 символів' })
  password: string
}
