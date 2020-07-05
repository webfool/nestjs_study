import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { CustomLoggerModule } from './Logger/logger.module'
import { LoginModule } from './features/Login/login.module'

@Module({
  imports: [LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
