import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common'
import { ValidationArguments } from 'class-validator'
import { Observable } from 'rxjs'
import { JwtPayload } from 'src/types'

export const USER_INJECTION = 'user_injection_context'

export interface ExtendedValidationArguments extends ValidationArguments {
  object: {
    [USER_INJECTION]: JwtPayload
  }
}

@Injectable()
export class InjectUserInterceptor implements NestInterceptor {
  constructor(private type?: 'query' | 'body' | 'param' | null) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()

    if (this.type && request[this.type]) {
      request[this.type][USER_INJECTION] = request.user
    }

    return next.handle()
  }
}

export function InjectUserToQuery() {
  return applyDecorators(InjectUserTo('query'))
}

export function InjectUserToBody() {
  return applyDecorators(InjectUserTo('body'))
}

export function InjectUserToParam() {
  return applyDecorators(InjectUserTo('param'))
}

export function InjectUserTo(context: 'query' | 'body' | 'param') {
  return applyDecorators(UseInterceptors(new InjectUserInterceptor(context)))
}
