import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for SketchUp extension
  app.enableCors({
    origin: '*', // Configure appropriately for production
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('LexaCut Cost Calculation API')
    .setDescription('API for calculating woodworking project costs with dynamic pricing management')
    .setVersion('1.0.0')
    .addTag('Cost Calculation', 'Calculate project costs from CSV or JSON data')
    .addTag('Materials Management', 'CRUD operations for materials and pricing')
    .addTag('Edge Banding Management', 'CRUD operations for edge banding types')
    .addTag('CNC Operations Management', 'CRUD operations for CNC operations')
    .addTag('Fittings Management', 'CRUD operations for fittings catalog')
    .addTag('Pricing Configuration', 'Manage overhead percentages and profit margins')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 4492;
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();
