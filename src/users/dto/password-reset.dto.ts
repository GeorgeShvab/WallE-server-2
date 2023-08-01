import { IsEmail, IsNotEmpty, MaxLength, MinLength, Validate } from 'class-validator'

export class RequestPasswordResetDto {
  @IsNotEmpty({ message: 'Вкажіть коректний емейл' })
  @IsEmail({}, { message: 'Вкажіть коректний емейл' })
  email: string
}

export class PasswordResetDto {
  @IsNotEmpty({ message: 'Введіть пароль' })
  @MinLength(6, { message: 'Пароль повинен містити принанні 6 символів' })
  @MaxLength(100, { message: 'Пароль повинен містити не більше 100 символів' })
  password: string

  @Validate(() => true)
  token: string
}
