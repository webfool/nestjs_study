import { Injectable } from "@nestjs/common";
import { CustomLoggerService } from '../../Logger/logger.service'

@Injectable()
export class LoginService {
  constructor(private customLoggerService: CustomLoggerService) {
    this.customLoggerService.setContext('LoginService')
  }

  login(): string {
    this.customLoggerService.log('login')
    this.customLoggerService.warn('login')
    this.customLoggerService.error('login', 'login')
    this.customLoggerService.debug('login')
    this.customLoggerService.verbose('login')
    return 'login service'
  }
}
