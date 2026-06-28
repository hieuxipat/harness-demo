import { useContainer } from 'class-validator';
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, VersioningType, VERSION_NEUTRAL, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { GlobalLogger } from './shared/logger/services/global-logger.service';
import { createDocument } from './docs/swagger';
import { swaggerOptions } from './docs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: new GlobalLogger() });
  app.useStaticAssets('src/public', {
    prefix: `/${process.env.API_ENDPOINT_PREFIX || 'api'}/public`,
    etag: true,
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*'); // Be more specific in production
    },
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });
  app.setGlobalPrefix(process.env.API_ENDPOINT_PREFIX || 'api');
  app.use(
    json({
      limit: '120mb',
      verify: (req: any, res, buf, encoding: BufferEncoding) => {
        if (req.headers['x-shopify-hmac-sha256']) {
          req.rawBody = buf.toString(encoding || 'utf8');
        }
        return true;
      },
    }),
  );
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  SwaggerModule.setup(`${process.env.API_ENDPOINT_PREFIX || 'api'}/docs`, app, createDocument(app), swaggerOptions);

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT || 3000);
  console.log(`API listen at port: ${process.env.PORT || 3000}`);
}

bootstrap();
