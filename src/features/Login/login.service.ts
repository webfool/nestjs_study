import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginService {

  login(): string {
    // throw new Error('abc')
    return 'login service'
  }
}
