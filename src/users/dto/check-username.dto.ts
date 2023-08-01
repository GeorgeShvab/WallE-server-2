import { IsUserNameTaken } from './decorators'

export class CheckUserNameDto {
  @IsUserNameTaken({ message: 'Користувач з таким нікнеймом вже зареєстрований' })
  userName: string
}
