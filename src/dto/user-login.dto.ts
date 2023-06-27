import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator'

export class UserLoginDto {
  @IsNotEmpty({ message: 'Невірний емейл або пароль' })
  @IsEmail({}, { message: 'Невірний емейл або пароль' })
  email: string

  @IsNotEmpty({ message: 'Невірний емейл або пароль' })
  @MinLength(6, { message: 'Невірний емейл або пароль' })
  @MaxLength(100, { message: 'Невірний емейл або пароль' })
  password: string
}
