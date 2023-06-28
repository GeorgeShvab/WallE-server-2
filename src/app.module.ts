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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
