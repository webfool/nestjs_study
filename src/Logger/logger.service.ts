/**
 * 总结：通过 extends Logger 生成自定义的 logger service，再在 logger Module 生成 logger service 的单例
 * 
 * 推荐的定义 CustomLoggerService 的方式：
 * - class CustomLoggerService extends Logger implements LoggerService {}
 * 
 * 方法一：
 * 目的：为根实例添加 logger 实例
 * 实现：
 * - { logger: new CustomLoggerService() } 作为 NestFactory.create 的第二个参数
 * 缺点：不能与其它 module 公用一个 logger 实例
 * 
 * 方法二（推荐）：
 * 目的：生成一个 logger 实例，能够被不同的模块注入，也能被 App 根实例使用
 * 实现：
 * - 定义一个 LoggerModule，将 LoggerService 导出
 * - 其它模块下，采用正常的 module 的 imports 的方式引入，再在其 service 中注入
 * - 根实例下，采用 app.useLogger(app.get(CustomLoggerService)) 使用 logger 实例
 */
import { Logger, LoggerService, Injectable } from "@nestjs/common";
// import { Logger as Logger4 } from 'log4js'
import { configure, getLogger, Logger as Logger4 } from 'log4js/lib/log4js'
import loggerConfig from './logger.config'

@Injectable()
export class CustomLoggerService extends Logger implements LoggerService {
  private readonly appLogger: Logger4
  constructor() {
    super()
    configure(loggerConfig)
    this.appLogger = getLogger('app')
  }

  log(message: string): void {
    this.appLogger.info(message)
  }

  error(message: string): void {
    this.appLogger.error(message)
  }

  warn(message: string): void {
    this.appLogger.warn(message)
  }

  debug(message: string): void {
    this.appLogger.debug(message)
  }

  verbose(message: string): void {
    this.appLogger.info(message)
  }

  // error(message: string, trace: string): void {
  //   // message 是报错对象的信息；trace 是报错对象的格式化字符串
  //   // console.error(`【CustomLogger - error】 an error happened!`)

  //   // 注：super 关键字在 constructor 中指向父类构造函数，在方法中指向父类构造函数的原型。super 可以在重写父类方法时，调用父类方法
  //   // 继承可以通过 super 方法调用内置方法。
  //   super.error(message, trace)
  // }
}