import { IsNotEmpty } from 'class-validator'
import { NotFoundError } from 'rxjs'
import { IsObjectId } from 'src/decorators/isValidObjectId'

export class AddDocumentDto {
  @IsNotEmpty()
  @IsObjectId({ error: NotFoundError }, { message: 'Невірний формат значення' })
  document: string
}
