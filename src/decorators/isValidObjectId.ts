import { BadRequestException, Injectable } from '@nestjs/common'
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
    return isValidObjectId(value)
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid object id`
  }
}

export function IsObjectId(
  options: { error?: any } = { error: BadRequestException },
  validationOptions?: ValidationOptions
) {
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
