import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Bookmark, BookmarkSchema } from 'src/schemas/bookmark.schema'
import { BookmarksService } from './bookmarks.service'
import { BookmarksController } from './bookmarks.controller'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Bookmark.name,
        schema: BookmarkSchema,
      },
    ]),
  ],
  providers: [BookmarksService],
  controllers: [BookmarksController],
})
export class BookmarksModule {}
