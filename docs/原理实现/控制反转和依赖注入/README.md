# 控制反转(IOC)和依赖注入(DI)

### 什么是控制反转和依赖注入
> IOC: Inversion of Control

> DI: Dependency Injection


控制反转和依赖注入都是指同一个思想，即类只需标注自己依赖哪些对象，然后由容器统一负责在创建类对象时，为其创建和注入其依赖的对象。

为什么叫控制反转？因为传统的对象创建过程中，会在类的内部创建依赖的其它对象或资源，控制权在当前类。IOC 方式相对于传统的创建过程，创建对象和资源将交由容器统一管理，即控制权反转了，所以称为控制反转。

为什么叫依赖注入？仅看到控制反转时，语义并不够清晰，所以后面又增加了一种称呼叫依赖注入。依赖即对象需要依赖 ioc 容器的资源，注入即 ioc 容器会注入对象所需的其它对象。

### IOC 和 DI 的优点
- 【松耦合、灵活性高】：传统方式创建对象时，在类内部主动创建其依赖的对象和资源，所以耦合度高。而IOC的方式只需要声明类依赖的对象，耦合度低，需要修改依赖时改动小，故而灵活性高。
- 【复用】：在 IOC 统一负责对象的创建和注入，实现功能的复用

# nestjs 中ioc的简要实现
nestjs 的 ioc 简要实现思路：
- 结合 ts 和装饰器为类添加元数据，元数据即代表依赖的对象
- 传入 ioc 容器，ioc 容器获取元数据，并通过元数据生成依赖对象，再注入当前类生成实例

## 元数据

### Reflect-metadata 手动添加元数据
ts 中默认采用 Reflect-metadata 库为类添加元数据，这个库的用法很简单，下面介绍几个常用方法：

- 添加元数据

Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)
> 为 target 的 propertyKey 属性的元数据对象添加一对元数据，元数据的 key 为 metadataKey，元数据的 value 为 metadataValue。

- 获取元数据

Reflect.getMetadata(metadataKey, target, propertyKey)
> 获取 target 的 propertyKey 的元数据对象中，key 为 metadataKey 的 value 值。

- 生成添加元数据的装饰器

Reflect.metadata(metadataKey, metadataValue)
> 当装饰器用，为装饰对象的元数据对象中添加一对元数据

```js
@Reflect.metadata(metadataKey, metadataValue)
class Test {}
```

### 默认存储的类型元数据
##### 装饰器语法示例：
如下语法用来装饰类，该语法只是一种语法糖，经 ts 编译之后，转成的代码会将 Project 传入 Injectable 进行装饰。该模式对应设计模式中的装饰器模式。
```js
function Injectable(target) {
  target.isInjectable = true
}

@Injectable
class Project {}

```
[阮一峰]: https://es6.ruanyifeng.com/#docs/decorator

对于装饰器的详细用法不再赘述，有兴趣的可以参考[阮一峰大神的装饰器][阮一峰]介绍。

以下对装饰器的用法做一些简单总结：
##### 不同类型的装饰器接收的参数：
- 类装饰器：类对象
- 属性装饰器：属性所在的对象（类就返回类，类的原型就返回类的原型，下同）、属性名
- 方法装饰器：方法所在的对象、方法名、描述对象
- 参数装饰器：方法所在的对象、方法名、参数位置(从0开始)，特别注意 constructor 的参数装饰器分别接收：类、undefined、参数位置

##### 默认存储类型元数据
如果需要 ts 在编译后会默认存储类型元信息，需要在需存储类型的地方添加装饰器，装饰器的内容不重要。类型元信息存储在以下有3种固定的key下：design:type、design:paramtypes、design:returntype。这个特点对我们实现依赖注入很重要。另外 ts 还是需要开启 experimentalDecorators 和 emitDecoratorMetadata 配置。即
> tsc index.ts --experimentalDecorators --emitDecoratorMetadata --target es5

```js
class FrontEnd {
  frontendLang: string[] = ['js', 'html', 'css']
}

class BackEnd {
  backendLang: string[] = ['java', 'mysql']
}

@Injectable
class Project {
  constructor( public frontEnd: FrontEnd, public backEnd: BackEnd) {}
}

// 以上代码经 ts 编译后，会自动为 Project 添加 design:paramstypes 的元信息
// @Injectable 里面的装饰内容其实无关紧要，但是一定要有，如果没有添加装饰器，ts 编译时将不会有添加 design:paramstypes 的代码
console.log(Reflect.getMetadata('design:paramstypes', Project)) // [FrontEnd, BackEnd]
```

以上只是装饰器放在类时添加的元数据，还有其它情况：

- 为类或者类 constructor 的方法参数使用了装饰器，ts 编译之后类 constructor 的所有参数的类型会存储在 design:paramtypes
- 为属性添加装饰器，ts 编译之后会在当前属性的类型会存储在 design:type
- 为方法或方法参数添加装饰器，ts 编译之后当前方法的类型、函数参数类型、函数返回值类型会分别存储在 design:type、design:paramtypes、design:returntype

##### 获取类型的规则：
以上例子中类型是通过 class 定义的，class 既存在于 ts 中，也存在于编译后的 js 中，所以能直接存储，对于其它情况：
- 如果类型是 interface，则存的类型是 Object 构造函数
- 如果类型是 js 的数据类型，则存的类型是其对应的构造函数
```js
@Injectable
class Project {
  constructor( public frontEnd: string, public backEnd: {name: string}) {}
}

console.log(Reflect.getMetadata('design:paramstypes', Project)) // [String, Object]
```

## ioc 容器
[github]: https://github.com/webfool/nestjs_study/tree/master/docs/%E5%8E%9F%E7%90%86%E5%AE%9E%E7%8E%B0/%E6%8E%A7%E5%88%B6%E5%8F%8D%E8%BD%AC%E5%92%8C%E4%BE%9D%E8%B5%96%E6%B3%A8%E5%85%A5
ioc 的实现通过 js 代码给大家呈现，方便大家理解思路，如果想看 ts 版本，欢迎到我的 [github 仓库][github]查看，如果有帮助，欢迎star。

### ioc 容器的实现思路
#### 注册 provider

Container 通过 Map 对象存储所有 provider，用来管理所有依赖对象。
```js
export default class Container {
  provides = new Map()

  addProvide(provider) {
    this.provides.set(provider.provide, provider)
  }
}
```

每一个 provider 的类型如下：
```js
// provide 是标识，useClass/useValue/useFactory 都是用来生成实例的
Provider =
  {provide: xxx, useClass: xxx} | // 在 nestjs 中，如果通过 useClass 传入一个类，那么将会实例这个类
  {provide: xxx, useValue: xxx} | // 在 nestjs 中，如果通过 useValue 传入一个对象，那么将会直接使用这个对象
  {provide: xxx, useFactory: () => xxx} // 在 nestjs 中，如果通过 useFactory 传入一个工厂函数，那么将会使用工厂函数的返回值
```

#### 类的实例化

1. 当某个类需要被实例时，把类的标识传入容器，容器通过标识找到对应的 provider，再准备开始生成实例。
2. 生成实例的过程中，容器先把类装饰的元数据取出来，通过这些元数据获取其依赖的其它对象的标识
3. 再拿这些标识去 provides 列表中取出 provide 字段与标识匹配的 provider
4. 再根据是 useClass、useValue 或 useFactory 采取不同的策略生成依赖的实例对象。
5. 最后再把生成的依赖的实例对象传入类，生成类的实例

```js
const INJECT_METADATA_KEY = 'INJECT_METADATA';

// 除 ts 存入的类型元信息外，允许注入自定义的 token 标识
export function Inject(token) {
  return (target, key, index) => {
    Reflect.defineMetadata(INJECT_METADATA_KEY, token, target, `index-${index}`)
  }
}

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
      return Reflect.construct(target, args)
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
# 装饰器结合 Container 的使用案例
```js
class FrontEnd {
  frontendLang: string[] = ['js', 'html', 'css']
}

class BackEnd {
  backendLang: string[] = ['java', 'mysql']
}

class Operation {
  operationLang: string[] = ['nginx', 'jenkins']
}

class Pm {
  pmLang: string[] = ['word', 'ppt']
}


class InjectToken {
  constructor(public injectionIdentifier: string) {}
}
const pmToken = new InjectToken('pmToken')

@Injectable
class Project {
  constructor(
    public frontEnd: FrontEnd, // 元数据存入 FrontEnd
    public backEnd: BackEnd, // 元数据存入 BackEnd
    public operation: Operation, // 元数据存入 Operation
    @Inject(pmToken) public pm: FrontEnd // 元数据存入 FrontEnd 和 pmToken，实际使用时 pmToken 会覆盖 FrontEnd
  ) {}
}

const container = new Container()

container.addProvide({ provide: FrontEnd, useClass: FrontEnd })
container.addProvide({ provide: BackEnd, useValue: new BackEnd() })
container.addProvide({ provide: Operation, useFactory: () => new Operation()})
container.addProvide({ provide: Project, useClass: Project })
container.addProvide({ provide: pmToken, useClass: Pm})

const project = container.inject(Project)

console.log('project ->', project)

```
```js
打印结果：
project -> Project {
  frontEnd: FrontEnd { frontendLang: [ 'js', 'html', 'css' ] },
  backEnd: BackEnd { backendLang: [ 'java', 'mysql' ] },
  operation: Operation { operationLang: [ 'nginx', 'jenkins' ] },
  pm: Pm { pmLang: [ 'word', 'ppt' ] }
}
```
