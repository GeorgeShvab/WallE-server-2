import { Injectable } from '@nestjs/common'
import {
  ValidatorConstraintInterface,
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
  ValidatorConstraint,
} from 'class-validator'

@ValidatorConstraint({ name: 'isValidAccessType', async: true })
@Injectable()
export class AccessTypeValidatorConstraint implements ValidatorConstraintInterface {
  constructor() {}

  validate(value: string): boolean {
    return ['private', 'public', 'restricted', 'partly-restricted'].includes(value)
  }

  defaultMessage(args: ValidationArguments) {
    return `Invalid access type`
  }
}

export function IsValidAccessType(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string): void {
    registerDecorator({
      name: 'isValidAccessType',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: AccessTypeValidatorConstraint,
    })
  }
}
