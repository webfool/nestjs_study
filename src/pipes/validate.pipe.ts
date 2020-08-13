import { Injectable, PipeTransform, ArgumentMetadata, ValidationPipe } from "@nestjs/common";
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// 方式一：自定义 transform 的校验逻辑
// @Injectable()
// export class ValidatePipe implements PipeTransform<any, Promise<any>> {
//   // eslint-disable-next-line
//   async transform(value: any, metaData: ArgumentMetadata): Promise<any> {
//     console.log('value ->', value)
//     const metatype = metaData.metatype
//     console.log('metatype ->', metatype)
    
//     const object = plainToClass(metatype, value)
//     const errors = await validate(object)
//     console.log('errors ->', errors)
    
//     return value
//   }
// }

// 方式二：使用内置 ValidationPipe 进行DTO类型自动校验，基本类型会直接通过
export const ValidatePipe = new ValidationPipe({
  // disableErrorMessages: true // 不返回具体的报错信息
  whitelist: true, // 打开白名单功能，默认过滤掉没有添加校验装饰器的属性
  // forbidNonWhitelisted: true, // 存在不是 DTO 设置的属性时，返回报错。使用该属性前需 whitelist: true
  // 开启之后，对 value 和类型都是基本类型的情况，会进行尝试转换。如 value 为 '12'，类型为 number，会转换为 12。不管结果如何都会返回
  // 此属性建议不使用，在需要校验的地方采用类似 ParseIntPipe 进行转换
  // transform: true
})
