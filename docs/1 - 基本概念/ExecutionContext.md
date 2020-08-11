可以通过两个对象获取当前执行上下文信息：ArgumentsHost 和 ExecutionContext

#### 总结
ArgumentHost: 用于获取请求对象和返回对象，在 filter 中提供
ExecutionContext: 获取请求/返回对象，也可以获取 handler 和 controller，在 guard 和 interceptor 中提供

#### ArgumentsHost
框架会在某些场景下给你提供 ArgumentsHost 的实例，如 exception filter 的 catch 方法中

它含有如方法：
- getType 获取应用类型，值有：http、rpc、graphql
- getArgs 获取当前上下文的相关对象（不推荐）
```js
const [req, res, next] = host.getArgs()
```
- getArgByIndex 直接按数组顺序获取相关对象（不推荐）
```js
const request = getArgByIndex(0)
const response = getArgByIndex(1)
```
- switchToHttp、switchToRpc、switchToWs 转换成特定的 ArgumentsHost 对象
```js
const ctx = host.switchToHttp(); // 转换成 HttpArgumentsHost
const request = ctx.getRequest<Request>();
const response = ctx.getResponse<Response>();
```

#### ExecutionContext
ExecutionContext 继承 ArgumentsHost，框架会在某些场景下提供 ExecutionContext 的实例，如 guard 的 canActivate 方法 和 interceptor 的 intercept 的方法

它除了包含 ArgumentsHost 的方法外，还额外有如下方法：
- getHandler 获取路由处理函数
- getClass 获取 controller 类

它相比于 ArgumentsHost，可以往下获取上下文

##### reflector
通过以上两个方法，再借用 reflector，我们可以获取通过 SetMetadata 给 controller 或 route 定义的元数据

- reflector.get
```js
// 先注入
@Injectable()
export class RolesGuard {
  constructor(private reflector: Reflector) {}
}

// 再调用
const roles = this.reflector.get<string[]>('roles', context.getHandler());
```
- reflector.getAllAndOverride
同时获取 handler 和 controller 的元数据，前面的会覆盖后面的
```js
const roles = this.reflector.getAllAndOverride<string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);
```
- reflector.getAllAndMerge
同时获取 handler 和 controller 的元数据，两者会进行合并
```js
const roles = this.reflector.getAllAndMerge<string[]>('roles', [
  context.getHandler(),
  context.getClass(),
]);
```