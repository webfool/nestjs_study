// import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { Module } from '@nestjs/common'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './features/Login/login.module'
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core';
// import { LoggerMiddleware } from './middlewares/logger.middleware'
import { LoggerInterceptor } from './interceptors/logger.interceptor'
import { CustomLoggerModule } from './Logger/logger.module'
import { HttpExceptionFilter } from './exceptionFilter/http.exceptionFilter'
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [CustomLoggerModule, LoginModule],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD, // 全局守卫
      useClass: PermissionGuard
    },
    {
      provide: APP_INTERCEPTOR, // 全局拦截器
      useClass: LoggerInterceptor
    },
    {
      provide: APP_FILTER, // 全局过滤器
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
