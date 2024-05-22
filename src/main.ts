import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './modules/app/app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: '*', // Adjust according to your needs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
    allowedHeaders: [
      'Accepted',
      'Content-Type',
      'Authorization',
    ]
  });
  const config = new DocumentBuilder()
    .setTitle('backend-utip')
    .setDescription('The utip API description')
    .setVersion('1.0')
    .addTag('')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
  app.setGlobalPrefix('api')
  await app.listen(3000)
}
bootstrap()
