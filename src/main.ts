import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  // NestFactory 创建 nest 应用的实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置静态资源路径
  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/static/'
  })
  await app.listen(3000);
}
bootstrap();
