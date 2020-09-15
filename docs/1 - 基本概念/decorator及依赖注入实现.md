## 控制反转和依赖注入
控制反转和依赖注入其实是表达同一概念。

采用控制反转和依赖注入的方式，有如下优点：
- 低耦合：对象只需要配置自己需要的资源，不需要自己去创建资源，能够降低资源耦合
- 功能复用：

#### 控制反转 IOC (Inversion Of Control)
传统的程序设计中，通常在对象中通过 new 的方式生成依赖的实例对象，属于主动创建依赖对象。控制反转的设计中，有一个专门的容器负责对象的创建和控制对象的获取。

#### 依赖注入 DI（Dependency Injection）
应用程序依赖 IOC 容器，容器为应用程序注入依赖对象。




## 装饰器
装饰器：一种用来修改类和类属性的语法，它是在编译阶段执行的代码。它的优点是语义强，可拔插方便。

使用语法：
- @+(函数名/生成函数的表达式)
- 多个装饰器时，由上到下此次对装饰器表达式求值，再由下至上进行装饰

装饰器接收的参数：
- 类装饰器：类对象
- 属性装饰器：属性所在的对象、属性名
- 方法装饰器：方法所在的对象、方法名、描述对象
- 参数装饰器：方法所在的对象、方法名、参数位置(从0开始)，特别注意 constructor 的参数装饰器分别接收：类、undefined、参数位置

添加装饰器后，ts 编译会自动存储的元信息：
- 为类或者类 constructor 的方法参数使用了装饰器，ts 编译之后类会存储 design:paramtypes 元信息
- 为属性添加装饰器，ts 编译之后会存储 design:type 元信息
- 为方法或方法参数添加装饰器，ts 编译之后会存储 design:type、design:paramtypes、design:returntype 元信息

存储元信息时：
- 如果类型是 js 的数据类型，则存的元数据是其对应的构造函数
- 如果类型是 interface，则存的元数据是 Object 构造函数


### 类中使用装饰器
类装饰器只能接收到一个参数，即为当前装饰的类

不需要返回值
```js
function testable(target) {
  target.isTest = true
}

@testable
class MyClass {}
```

### 类属性中使用装饰器
类属性装饰器能接收到2个参数
- 静态属性下分别为：类、属性名
- 实例属性下分别为：类的原型对象、属性名

不需要返回值
```js
// 静态属性的装饰器：target 为类
function StaticPropDec(target, name) {
  target.isTest = true
}

// 实例属性的装饰器：target 为类的原型对象
function InsPropDec(target, name) {
  console.log('from decorator')
}

class MyClass {
  @StaticPropDec
  static name = 'hw'

  @InsPropDec
  from = 'china'
  // 有个细节需要注意：
  // 此处的实际效果是 MyClass 原型对象 from: undefined，而其每一个生成的实例对象都是 from: 'hw'。
  // 如果为 from 添加装饰器，其实是对原型对象的 from 属性进行修改，实例对象对该属性的操作将不受影响
}
```

### 类方法中使用装饰器
类方法装饰器能接收到3个参数
- 静态成员方法分别为：类、属性名、属性的描述对象
- 实例成员方法分别为：类的原型对象，属性名，属性的描述对象

类方法或访问器的装饰器的返回值作为方法的属性描述符
```js
// 静态成员方法的装饰器接收的 target 为类
function Testable(target, name, descriptor) {
  target.isTest = true
}

// 实例成员方法的装饰器接收的 target 为类的原型对象
function Readonly(target, name, descriptor) {
  descriptor.writable = false
  return descriptor
}

// 访问器成员的装饰器接收参数与实例成员装饰器接收的一致
function TestAccess(target, name, descriptor) {
  descriptor.configurable = false
  return descriptor
}

class MyClass {
  @Testable
  static sayAge() {
    console.log(25)
  }

  @Readonly
  sayName() {
    console.log('name')
  }

  @TestAccess
  get from() {
    return 'china'
  }
}
```

### 参数装饰器
参数装饰器能接收到3个参数
- 静态方法的参数装饰器接收到的分别是：类、方法名、参数的序号
- 实例方法的参数装饰器接收到的分别是：类的原型对象、方法名、参数的序号

不需要返回值
```js
// 静态方法的参数装饰器：target 为类
function StaticParamDec(target, name, paramIndex) {
  console.log('args ->', args)
}

// 实例方法的参数装饰器：target 为类的原型对象
function InsParamDec(target, name, paramIndex) {
  console.log('args ->', args)
}



class Test {
  static sayName(@StaticParamDec name: string) {
    console.log(name)
  }

  sayAge(@InsParamDec age: number) {
    console.log(age)
  }
}

console.log((Test as any).isTest)
```

## reflect-metadata

#### 手动操作的元数据
##### 操作只针对当前对象
- Reflect.defineMetadata
- Reflect.hasOwnMetadata
- Reflect.getOwnMetadata
- Reflect.deleteMetadata
- Reflect.getOwnMetadataKeys

##### 操作涉及原型链
- Reflect.hasMetadata
- Reflect.getMetadata
- Reflect.getMetadataKeys

##### 元数据装饰器
@Reflect.metadata(metadataKey, metadataValue)
```js
@Reflect.metadata('testKey', 'testValue')
class MyClass {}
```

#### 自动添加的元数据
编译时，拥有 Reflect.metadata 装饰器的属性能自动添加“属性类型”、“函数参数类型”、“函数返回值类型” 元数据。需要注意的是，类型必须定义好，不允许类型推断。

```js
@Reflect.metadata(undefined, undefined)
class MyClass {
  constructor(private name: string, private age: string) {}

  @Reflect.metadata(undefined, undefined)
  say(word: string, age: number) : number {
    return 1
  }
}

// 获取类的参数类型，此处为 [String, Number]
console.log(Reflect.getMetadata('design:paramtypes', MyClass))

// 整个属性的类型，此处为 Function
console.log(Reflect.getMetadata('design:type', MyClass.prototype, 'say'))
// 函数所有参数的类型，此处为 [String, Number]
console.log(Reflect.getMetadata('design:paramtypes', MyClass.prototype, 'say'))
// 函数返回值的类型，此处为 Number
console.log(Reflect.getMetadata('design:returntype', MyClass.prototype, 'say'))
```

## 依赖注入简要实现
```js
class MyService {
  a = 1
}

@Reflect.metadata(undefined, undefined) // Nest 的 @Injectable() 中有加这个处理
class MyClass {
  constructor(private service: MyService) {}

  say() {
    console.log(this.service.a)
  }
}

const Factory = (target) => {
  const args = Reflect.getMetadata('design:paramtypes', target).map(provider => new provider())
  return new target(...args)
}

const me = Factory(MyClass)
me.say()
```