import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * 自定义 param decorator，此处以返回 ip 为例
 */
export const Cookie = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  return req.headers.cookie
})