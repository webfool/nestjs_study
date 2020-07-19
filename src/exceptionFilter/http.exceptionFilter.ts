import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { CustomLoggerService } from '../Logger/logger.service'

export interface ErrorData {
  code: number
  msg: string
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly customLoggerService: CustomLoggerService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    let code: number
    let json: ErrorData
    
    if (exception instanceof HttpException) {
      const exceptionRes = exception.getResponse()
      const status = exception.getStatus()

      // 抛出 HttpException 时，第一个参数是字符串
      if (typeof exceptionRes === 'string') {
        code = status
        json = {
          code,
          msg: exceptionRes
        }
      } else { // 抛出 HttpException 时，第一个参数是对象
        code = (exceptionRes as any).statusCode || status || HttpStatus.INTERNAL_SERVER_ERROR
        json = {
          code,
          msg: (exceptionRes as any).message || 'Internal server error'
        }
      }
    }
    else {
      code = HttpStatus.INTERNAL_SERVER_ERROR
      json = {
        code,
        msg: 'Internal server error'
      }
    }

    this.saveLog(request, exception)

    response.status(code).json(json)
  }

  saveLog(request: Request, exception: unknown): void {
    const { method ,url, headers, body } = request
    const ua = headers['user-agent']

    let err: string
    if (exception instanceof HttpException) {
      err = JSON.stringify(exception)
    } else if (exception instanceof Error) {
      err = JSON.stringify(exception, Object.getOwnPropertyNames(exception))
    } else if (exception && exception.toString && typeof exception.toString === 'function') {
      err = exception.toString()
    } else {
      err = 'Unknow Internal server error'
    }

    this.customLoggerService.error(
      `${ua} ${method} ${url} body: ${JSON.stringify(body)} err: ${err}`
    )
  }
}