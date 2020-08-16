import { Controller, Get, Param, ParseIntPipe, Query, Post, Body, ParseArrayPipe } from "@nestjs/common";
import { LoginService } from './login.service'
import { HasPermission } from "src/decorators/permission.decorator";
import { Item } from './login.type'
import { Cookie } from 'src/decorators/cookie.decorator'

@Controller('account')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('login')
  @HasPermission('login')
  login(@Cookie() cookie: string): string {
    console.log('cookie ->', cookie)
    return cookie
    // return this.loginService.login()
  }

  @Get('logout')
  @HasPermission('logout')
  logout(): string {
    return 'logout'
  }

  // 对基本类型进转换
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) data: number
  ): any {
    return data
  }

  // 实现对数组每一项的属性过滤和校验
  @Post('list')
  addMany(@Body(new ParseArrayPipe({items: Item, whitelist: true})) list: Item[]): any {
    return list
  }

  // 实现对数组每一项进行转换
  @Get('info')
  findByIds(@Query('ids', new ParseArrayPipe({separator: ',', items: Number})) ids: number[]): any {
    return ids
  }
}
