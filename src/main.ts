import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './shared/jwt/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('App Notes - API')
    .setDescription('API com recursos do App Notes')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: "Informe o token para autenticar na api",
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      },
      'JWT',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();
