import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (...args: any[]) => any): void {
    // console.log('req ->', req)
    next()
  } 
}

// 函数式中间件，全局注册只能用函数式
// export function LoggerMiddleware (req: Request, res: Response, next: () => void): void {
//   // console.log('req ->', req)
//   next()
//   console.log('res ->', res)
// }
