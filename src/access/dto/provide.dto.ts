import { IsNotEmpty } from 'class-validator'
import { IsObjectId } from 'src/decorators/isValidObjectId'
import { IsValidAccessType } from './custom-decorators'

export class ProvideAccessDto {
  @IsNotEmpty({ message: 'Заповніть поле' })
  @IsObjectId({}, { message: 'Невірний формат значення' })
  email: string

  @IsNotEmpty({ message: 'Заповніть поле' })
  @IsObjectId({}, { message: 'Невірний формат значення' })
  document: string

  @IsNotEmpty({ message: 'Заповніть поле' })
  @IsValidAccessType()
  access: string
}
