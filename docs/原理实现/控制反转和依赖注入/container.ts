import {Type, Token, Provider, InjectToken, ClassProvider, ValueProvider, FactoryProvider} from './types'
import { getInjectToken } from './inject'

export default class Container {
  public provides = new Map<Token<any>, Provider<any>>()

  addProvide<T>(provider: Provider<T>): void {
    this.provides.set(provider.provide, provider)
  }

  inject<T>(token: Token<T>): T {
    const provider = this.provides.get(token)

    if (provider === undefined) {throw new Error(`no provider for ${this.getTokenName<T>(token)}`)}

    if (this.isClass<T>(provider)) {
      const target = provider.useClass
      const paramTypes = Reflect.getMetadata('design:paramtypes', target) || []
      const args = paramTypes.map((type: Type<any>, index: number) => {
        const overrideToken = getInjectToken<T>(target, index)
        const actualToken = overrideToken || type
        return this.inject(actualToken)
      })
      return Reflect.construct(target, args)
    } else if (this.isValue<T>(provider)) {
      return provider.useValue
    } else if (this.isFactory(provider)) {
      return provider.useFactory()
    }
  }

  isClass<T>(provider: Provider<T>): provider is ClassProvider<T> {
    return (<ClassProvider<T>>provider).useClass !== undefined
  }

  isValue<T>(provider: Provider<T>): provider is ValueProvider<T> {
    return (<ValueProvider<T>>provider).useValue !== undefined
  }

  isFactory<T>(provider: Provider<T>): provider is FactoryProvider<T> {
    return (<FactoryProvider<T>>provider).useFactory !== undefined
  }

  getTokenName<T>(token: Token<T>): string {
    return token instanceof InjectToken ? token.injectionIdentifier : token.name
  }
}