import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { error } from 'console';
import { LoggingInterceptor } from './shared/interceptor/ogging.interceptor';
import { TransformInterceptor } from './shared/interceptor/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //* Tu dong chuyen data truyen len cua client thanh DTO
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (validationErrors) => {
        console.log('ValidationPipe:', validationErrors);
        return new UnprocessableEntityException(
          validationErrors.map((error) => {
            return {
              field: error.property,
              error: Object.values(error.constraints as any).join(', '),
            };
          }),
        );
      },
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
