import { Module, Global } from "@nestjs/common";
import { CustomLoggerService } from './logger.service'

// 通过 @Global 定义为全局 Module，这样其它模块就不再需要先引入该模块即可在它们的 service 内依赖注入 CustomLoggerService
// 不过首先需要在 AppModule 里引入一次该模块
@Global()
@Module({
  providers: [CustomLoggerService],
  exports: [CustomLoggerService]
})
export class CustomLoggerModule {}