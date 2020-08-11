import { CanActivate, Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_METADATA } from "src/utils/default-setting";

// 模拟用户的静态权限
const staticPermission = ['login']

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    let handlerPermissions = this.reflector.get<string | string[]>(PERMISSION_METADATA, context.getHandler())
    handlerPermissions = typeof handlerPermissions === 'string' ? [handlerPermissions] : handlerPermissions
    if(handlerPermissions.some(r => staticPermission.includes(r))) return true
    else throw new UnauthorizedException('don not have permission') 
  }
}