// 为类生成类型
export type Type<T> = {
  new (...args: any[]): T
}

export class InjectToken {
  constructor(public injectionIdentifier: string) {}
}

export type Token<T> = Type<T> | InjectToken

interface BaseProvider<T> {
  provide: Token<T>
}

export interface ClassProvider<T> extends BaseProvider<T> {
  useClass: Type<T>
}

export interface ValueProvider<T> extends BaseProvider<T> {
  useValue: T
}

export interface FactoryProvider<T> extends BaseProvider<T> {
  useFactory: () => T
}

export type Provider<T> = ClassProvider<T> | ValueProvider<T> | FactoryProvider<T>

