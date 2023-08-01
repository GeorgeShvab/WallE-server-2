import { HttpException, HttpStatus } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import {
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator'
import { isValidObjectId } from 'mongoose'

@ValidatorConstraint({ name: 'IsObjectId', async: true })
@Injectable()
export class IsObjectIdValidatorConstraint implements ValidatorConstraintInterface {
  constructor() {}

  validate(value: string): boolean {
    if (isValidObjectId(value)) {
      return true
    }

    throw new HttpException('Not Found', HttpStatus.BAD_REQUEST)
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid object id`
  }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'IsObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsObjectIdValidatorConstraint,
    })
  }
}

export class IdParamDto {
  @IsObjectId({ message: 'Документ не знайдено' })
  id: string
}

export class IdAndUserParamDto {
  @IsObjectId({ message: 'Документ не знайдено' })
  id: string

  @IsObjectId({ message: 'Користувача не знайдено' })
  user: string
}
