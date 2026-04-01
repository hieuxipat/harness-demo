import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(process.env.PORT || {{server_port}});
  console.log(`Server running on port ${process.env.PORT || {{server_port}}}`);
}

bootstrap();
