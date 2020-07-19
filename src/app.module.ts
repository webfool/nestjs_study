// import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './features/Login/login.module'
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
// import { LoggerMiddleware } from './middlewares/logger.middleware'
import { LoggerInterceptor } from './interceptors/logger.interceptor'
import { CustomLoggerModule } from './Logger/logger.module'
import { HttpExceptionFilter } from './exceptionFilter/http.exceptionFilter'

@Module({
  imports: [CustomLoggerModule, LoginModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    AppService
  ],
})
export class AppModule{}

// 添加中间件消费
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(LoggerMiddleware).forRoutes('login')
//   }
// }
