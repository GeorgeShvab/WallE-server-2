import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/auth.guard'
import { User } from 'src/decorators/user'
import { JwtPayload } from 'src/types'
import { BookmarksService } from './bookmarks.service'

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksSerice: BookmarksService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMyBookmarks(@User() user: JwtPayload) {
    return await this.bookmarksSerice.getByUser(user._id)
  }
}
