import { Injectable } from '@nestjs/common'
import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'
import { UsersService } from 'src/users/users.service'

@ValidatorConstraint({ name: 'IsEmailTaken', async: true })
@Injectable()
export class IsEmailTakenValidation implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(value: string) {
    const user = await this.userService.findOneByEmail(value, { activated: true })

    if (user) {
      return false
    } else {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `User already exists`
  }
}

export function IsEmailTaken(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsUserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsEmailTakenValidation,
    })
  }
}

@ValidatorConstraint({ name: 'IsUserNameTaken', async: true })
@Injectable()
export class IsUserNameTakenValidation implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}

  async validate(value: string) {
    const user = await this.userService.findOneByUserName(value, { activated: true })

    if (user) {
      return false
    } else {
      return true
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `User already exists`
  }
}

export function IsUserNameTaken(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      name: 'IsUserExists',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsUserNameTakenValidation,
    })
  }
}

export default [IsUserNameTakenValidation, IsEmailTakenValidation]
