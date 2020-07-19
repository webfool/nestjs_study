import { Injectable, HttpException, HttpStatus } from "@nestjs/common";

@Injectable()
export class LoginService {

  login(): string {
    // throw new Error('abc')
    // throw new HttpException({
    //   statusCode: HttpStatus.BAD_REQUEST,
    //   message: '错误的请求'
    // }, HttpStatus.FORBIDDEN)
    return 'login service'
  }
}
