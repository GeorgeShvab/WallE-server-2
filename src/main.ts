import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, BadRequestException } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { useContainer } from 'class-validator'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory(errors) {
        const result = {}

        for (let error of errors) {
          result[error.property] = error.constraints[Object.keys(error.constraints)[0]]
        }

        throw new BadRequestException(result)
      },
    })
  )
  app.setGlobalPrefix('api')
  app.use(cookieParser())
  app.enableCors({
    origin: ['http://localhost:3000', 'http://192.168.31.166:3000', 'localhost:3000'],
    credentials: true,
  })
  useContainer(app.select(AppModule), { fallbackOnErrors: true })
  await app.listen(process.env.PORT)
}
bootstrap()
