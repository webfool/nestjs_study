import { InjectToken, Type } from "./types";

const INJECT_METADATA_KEY = 'INJECT_METADATA';

export function Inject<T>(token: InjectToken) {
  return (target: Type<T>, key: string, index: number): void => {
    Reflect.defineMetadata(INJECT_METADATA_KEY, token, target, `index-${index}`)
  }
}

export function getInjectToken<T>(target: Type<T>, index: number): InjectToken {
  return Reflect.getMetadata(INJECT_METADATA_KEY, target, `index-${index}`)
}

export function Injectable<T>(target: Type<T>): void {
  (<Type<T> & {isInjectable: boolean}>target).isInjectable = true
}