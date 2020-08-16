装饰器：一种用来修改类和类属性的语法，它是在编译阶段执行的代码。它的优点是语义强，可拔插方便。

使用语法：@+(函数名/生成函数的表达式)，多个装饰器时，执行顺序由内向外

- 类中使用装饰器

类装饰器只能接收到一个参数，即为当前装饰的类
```js
function testable(target) {
  target.isTest = true
}

@testable
class MyClass {}
```

- 类方法中使用装饰器

类方法装饰器能接收到3个参数，分别为：类的原型对象，属性名，属性的描述对象。
类属性装饰器只能接收2个参数，分别为：类的原型对象，属性名。
```js
function Readonly(target, name, descriptor) {
  descriptor.writable = false
  return descriptor
}

class MyClass {
  @Readonly
  sayName() {
    console.log('name')
  }
}
```

对于类的定义需要注意一点：
```js
class MyClass {
  // 此处的实际效果是 MyClass 原型对象 name: undefined，而其每一个生成的实例对象都是 name: 'hw'。
  // 如果为 name 添加装饰器，其实是对原型对象的 name 属性进行修改，实例对象对该属性的操作将不受影响
  name = 'hw'
}

const me = new MyClass()
```