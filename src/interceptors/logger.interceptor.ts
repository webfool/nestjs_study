import { NestInterceptor, Injectable, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { CustomLoggerService } from '../Logger/logger.service'

export interface Response<T> {
  code: number
  msg: string
  data: T
}

@Injectable()
export class LoggerInterceptor<T> implements NestInterceptor {
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map((data) => {
      // 如果应用内抛出错误，则不会走这里
      const result = {
        code: 0,
        msg: 'success',
        data
      }

      this.saveLog(context, result)

      return result
    }))
  }

  saveLog(context: ExecutionContext, data: Response<T>): void {
    const ctx = context.switchToHttp()
    const { method ,url, headers, body } = ctx.getRequest<Request>()
    const ua = headers['user-agent']
    this.customLoggerService.log(
      `${ua} ${method} ${url} body: ${JSON.stringify(body)} res: ${JSON.stringify(data)}`
    )
  }
}