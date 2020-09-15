import 'reflect-metadata'
import Container from './container'
import {Inject, Injectable} from './inject'
import { InjectToken } from './types'
/**
 * 装饰器接收的参数：
 * - 类装饰器：类对象
 * - 属性装饰器：属性所在的对象、属性名
 * - 方法装饰器：方法所在的对象、方法名、描述对象
 * - 参数装饰器：方法所在的对象、方法名、参数位置(从0开始)，特别注意 constructor 的参数装饰器分别接收：类、undefined、参数位置
 */

/**
 * 添加装饰器后，ts 编译会自动存储的元信息：
 * - 为类或者类 constructor 的方法参数使用了装饰器，ts 编译之后类会存储 design:paramtypes 元信息
 * - 为属性添加装饰器，ts 编译之后会存储 design:type 元信息
 * - 为方法或方法参数添加装饰器，ts 编译之后会存储 design:type、design:paramtypes、design:returntype 元信息
 * 
 * 存储元信息时：
 * - 如果类型是 js 的数据类型，则存的元数据是其对应的构造函数
 * - 如果类型是 interface，则存的元数据是 Object 构造函数
 */

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

const pmToken = new InjectToken('pmToken')

@Injectable
class Project {
  constructor(
    public frontEnd: FrontEnd, // useClass 的方式添加的 provider
    public backEnd: BackEnd, // useValue 的方式添加的 provider
    public operation: Operation, // useFactory 的方式添加的 provider
    @Inject(pmToken) public pm: FrontEnd // Inject 的方式添加的 provider
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
