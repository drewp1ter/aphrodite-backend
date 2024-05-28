import { NestFactory } from '@nestjs/core'
import { NestApplicationOptions } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { LoggerService } from './shared/services/logger.service'
import { AppModule } from './app.module'

async function bootstrap() {
  const appOptions: NestApplicationOptions = { cors: true, logger: new LoggerService('Main')  }

  const app = await NestFactory.create(AppModule, appOptions)
  app.setGlobalPrefix('api')

  const options = new DocumentBuilder().setTitle('Aphrodite').setVersion('1.0').addBearerAuth().build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/docs', app, document)

  await app.listen(3000)
}
bootstrap().catch((err) => {
  console.log(err)
})
