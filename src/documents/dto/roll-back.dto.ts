import { IsNotEmpty } from 'class-validator'
import { IsObjectId } from 'src/decorators/isValidObjectId'

export class RollBackDto {
  @IsNotEmpty({ message: 'Вкажіть версію' })
  @IsObjectId({}, { message: 'Вкажіть версію' })
  version: string
}
