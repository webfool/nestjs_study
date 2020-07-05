import { Module } from "@nestjs/common";
import { CustomLoggerModule } from '../../Logger/logger.module'
import { LoginController } from './login.controller'
import { LoginService } from './login.service'

@Module({
  imports: [CustomLoggerModule],
  providers: [LoginService],
  controllers: [LoginController]
})
export class LoginModule {}
