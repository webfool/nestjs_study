nestjs 的依赖注入

## 用法
#### 最基础用法，语法糖

login.service.ts
```js
import { Injectable } from "@nestjs/common";

@Injectable()
export class LoginService {
  login(): string {
    return 'login'
  }
}
```

login.controller.ts
```js
import { Controller, Get } from "@nestjs/common";
import { LoginService } from './login.service'

@Controller('account')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Get('login')
  login(): string {
    return this.loginService.login()
  }
}
```

login.module.ts
```js
import { Module } from "@nestjs/common";
import { LoginController } from './login.controller'
import { LoginService } from './login.service'

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [
    LoginService,
    // { // 语法糖
    //   provide: LoginService,
    //   useClass: LoginService,
    // }
  ],
})
export class LoginModule {}
```

#### 什么是控制反转和依赖注入
> IOC: Inversion of Control
> DI: Dependency Injection

控制反转和依赖注入都是指同一个思想，即类只需标注自己依赖哪些对象，然后由容器统一负责在创建类对象时，为其创建和注入其依赖的对象。

为什么叫控制反转？因为传统的对象创建过程中，会在类的内部创建依赖的其它对象或资源，控制权在当前类。IOC 方式相对于传统的创建过程，创建对象和资源将交由容器统一管理，即控制权反转了，所以称为控制反转。

为什么叫依赖注入？仅看到控制反转时，语义并不够清晰，所以后面又增加了一种称呼叫依赖注入。依赖即对象需要依赖 ioc 容器的资源，注入即 ioc 容器会注入对象所需的其它对象。

##### IOC 和 DI 的优点
- 【松耦合、灵活性高】：传统方式创建对象时，在类内部主动创建其依赖的对象和资源，所以耦合度高。而IOC的方式只需要声明类依赖的对象，耦合度低，需要修改依赖时改动小，故而灵活性高。
- 【复用】：在 IOC 统一负责对象的创建和注入，实现功能的复用

#### Inject 的使用
login.module.ts
```js
import { Module } from "@nestjs/common";
import { LoginController } from './login.controller'
import { LoginService } from './login.service'

class CustomClass {
  name = 'risk & dc'
}

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [
    LoginService,
    {
      provide: 'customToken',
      useClass: CustomClass
    }
  ],
})
export class LoginModule {}
```
login.service.ts
```js
import { Controller, Get, Inject } from "@nestjs/common";
import { LoginService } from './login.service'

@Controller('account')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    @Inject('customToken') private readonly customService: {name: string}
  ) {}

  @Get('login')
  login(): string {
    console.log('name ===>', this.customService.name);
    return this.loginService.login()
  }
}
```


#### 其它注册方法：useValue、useFactory
login.module.ts
```js
import { Module } from "@nestjs/common";
import { LoginController } from './login.controller'
import { LoginService } from './login.service'

class CustomClass {
  name = 'risk & dc!'
}

@Module({
  imports: [],
  controllers: [LoginController],
  providers: [
    LoginService,
    {
      provide: 'customToken',
      useClass: CustomClass
    },
    {
      provide: 'customValueToken',
      useValue: {
        name: 'risk & dc from value!'
      }
    },
    {
      provide: 'customFactoryToken',
      useFactory(): any {
        return {
          name: 'risk & dc from factory!'
        }
      }
    }
  ],
})
export class LoginModule {}
```

login.controller.ts
```js
import { Controller, Get, Inject } from "@nestjs/common";
import { LoginService } from './login.service'

@Controller('account')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    @Inject('customToken') private readonly customService: {name: string},
    @Inject('customValueToken') private readonly customValueService: {name: string},
    @Inject('customFactoryToken') private readonly customFactoryService: {name: string}
  ) {}

  @Get('login')
  login(): string {
    console.log('name ===>', this.customService.name);
    console.log('value name ===>', this.customValueService.name);
    console.log('factory name ===>', this.customFactoryService.name);
    return this.loginService.login()
  }
}
```

## 实现
实现依赖注入的两个要点：装饰器、IOC 容器

### 装饰器：添加元数据

#### Reflect 的简单使用
```js
require('reflect-metadata')

const fn = (name, age) => 1
Reflect.defineMetadata('design:paramstypes', [String, Number], fn)
console.log(Reflect.getMetadata('design:paramstypes', fn))
```

#### ts 中添加元数据
> tsc index.ts --experimentalDecorators --emitDecoratorMetadata --target es5
```js
import 'reflect-metadata';

function Injectable(target: any) {
  target.isInjectable = true
}

class FrontEnd {
  frontendLang: string[]
}

@Injectable
class Project {
  constructor( public frontEnd: FrontEnd) {}
}

console.log(Reflect.getMetadata('design:paramtypes', Project))
```

#### 自定义元数据
```js
import 'reflect-metadata';

function Injectable(target: any) {
  target.isInjectable = true
}

class FrontEnd {
  frontendLang: string[]
}

const INJECT_METADATA = 'INJECT_METADATA'
function Inject(token: any) {
  return function (target: any, key: string | undefined, index: number) {
    Reflect.defineMetadata(INJECT_METADATA, token, target, `index-${index}`)
  }
}

@Injectable
class Project {
  constructor(@Inject('frontToken') public frontEnd: FrontEnd) {}
}

console.log(Reflect.getMetadata(INJECT_METADATA, Project, 'index-0'))
```

### IOC 容器：根据元数据生成依赖 

#### 先注入依赖
```js
// 获取自定义的 token
export function getInjectToken(target, index) {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target, `index-${index}`)
}

// 容器的实现
export default class Container {
  provides = new Map()

  // 注册 provider
  addProvide(provider) {
    this.provides.set(provider.provide, provider)
  }

  // 通过 token 查找注册的 provider，并生成实例对象
  inject(token) {
    const provider = this.provides.get(token)

    if (provider === undefined) {throw new Error(`no provider`)}

    if (this.isClass(provider)) {
      const target = provider.useClass
      const paramTypes = Reflect.getMetadata('design:paramtypes', target) || []
      const args = paramTypes.map((type, index) => {
        const overrideToken = getInjectToken(target, index) // 获取当前参数自定义的 token
        const actualToken = overrideToken || type
        return this.inject(actualToken) // 通过 token 生成递归生成依赖的实例
      })
      // return Reflect.construct(target, args)
      return new Target(...args)
    } else if (this.isValue(provider)) {
      return provider.useValue
    } else if (this.isFactory(provider)) {
      return provider.useFactory()
    }
  }

  isClass(provider) {
    return provider.useClass !== undefined
  }

  isValue(provider) {
    return provider.useValue !== undefined
  }

  isFactory(provider) {
    return provider.useFactory !== undefined
  }
}
```

测试实例
