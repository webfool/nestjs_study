import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { CustomLoggerService } from './Logger/logger.service'

async function bootstrap() {
  // NestFactory 创建 nest 应用的实例
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // log(绿色)；warn(黄色)；error(红色)；debug(紫色)；verbose(蓝色)
    // logger: ['log', 'warn', 'error', 'debug', 'verbose']
    // logger: new CustomLoggerService()
  });

  // 处理跨域：允许跨域带 cookie
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
  });

  const logger = app.get(CustomLoggerService)
  app.useLogger(logger)

  // 配置静态资源路径
  app.useStaticAssets(join(__dirname, '..', 'static'), {
    prefix: '/static/'
  })
  await app.listen(4000, () => {
    logger.log('app is listen in 4000')
  });
}
bootstrap();
