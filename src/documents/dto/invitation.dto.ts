import { IsArray, IsNotEmpty, Validate } from 'class-validator'

export class InvitationDto {
  @IsNotEmpty()
  @IsArray()
  @Validate((value: any[]) => value.every((item) => typeof item === 'string'))
  emails: string[]
}
