import { Controller, Get } from "@nestjs/common";
import { LoginService } from './login.service'
import { HasPermission } from "src/decorators/permission.decorator";

@Controller('account')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('login')
  @HasPermission('login')
  login(): string {
    return this.loginService.login()
  }

  @Get('logout')
  @HasPermission('logout')
  logout(): string {
    return 'logout'
  }
}
