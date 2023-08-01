import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'
import { MailModule } from './mail/mail.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'
import { DocumentsModule } from './documents/documents.module'
import { AccessModule } from './access/access.module'
import { CollaboratorsModule } from './collaborators/collaborators.module'
import { FoldersModule } from './folders/folders.module'
import { RecordsModule } from './records/records.module'
import { HoldersModule } from './holder/holders.module'
import { BookmarksModule } from './bookmarks/bookmarks.module'

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env.local', '.env'] }),
    MongooseModule.forRoot(process.env.DATABASE_LINK),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
      serveRoot: '/static',
    }),
    UsersModule,
    MailModule,
    AuthModule,
    DocumentsModule,
    AccessModule,
    CollaboratorsModule,
    FoldersModule,
    RecordsModule,
    HoldersModule,
    BookmarksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
