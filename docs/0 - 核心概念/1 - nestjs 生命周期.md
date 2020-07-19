执行顺序:
客户端请求 -> 中间件 -> 守卫 -> request 拦截器 -> 管道 -> controller & services -> response 拦截器 -> 过滤器

```js
- incoming request

// middleware：对请求做处理，如 compression
- Globally bound middleware
- Module bound middleware

// guard：权限管理
- Globally guards // app.useGlobalGuard() 或者 通过 module 提供一个 component，即被认为是全局 guard
- Controller guards
- Route guards

// request interceptor：获取请求信息，做一些日志功能
- Global interceptors
- Controller interceptors
- Route interceptors

// Pipes：数据验证和转换
- Global pipes
- Controller pipes
- Route pipes
- Route parameter pipes

// controller & service：业务处理
- Controller
- Service

// response interceptor：修改响应数据
- Route interceptors
- Controller interceptors
- Global interceptors

// filter：处理异常
- Exception filters (route -> controller -> global)

- Server response
```
