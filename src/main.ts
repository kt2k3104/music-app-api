import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('List APIs for Simple Blog')
    .setVersion('1.0')
    .addTag('Auth')
    .addTag('User')
    .addTag('Song')
    .addTag('Playlist')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.enableCors()

  await app.listen(9000)
}
bootstrap()
