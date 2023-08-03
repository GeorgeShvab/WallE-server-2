import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common'
import { Request } from 'express'
import { isValidObjectId } from 'mongoose'
import { AccessService } from 'src/access/access.service'
import { DocumentsService } from './documents.service'

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly accessService: AccessService,
    private readonly documentsService: DocumentsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest()

    const id = req.params.id

    if (!isValidObjectId(id)) {
      throw new NotFoundException()
    }

    const [document, access] = await Promise.all([
      this.documentsService.findOneById(id),
      this.accessService.hasAccess(id, req?.user?._id),
    ])

    if (
      (document?.access === 'private' ||
        (document?.access === 'restricted' && !access) ||
        (document?.access === 'partly-restricted' && !access && req.method !== 'GET')) &&
      document?.owner.toString() !== req?.user?._id
    ) {
      throw new ForbiddenException()
    }

    return true
  }
}
