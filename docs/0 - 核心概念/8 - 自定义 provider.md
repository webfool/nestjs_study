## nestjs 依赖注入的代码基本结构

- 生成可以被 IOC 容器管理的依赖
```js
import { Injectable } from '@nestjs/common';

@Injectable() // Injectable 装饰器标注当前类可以被注入
export class ScoresService {
  private readonly scores: number[] = [];

  findAll(): number[] {
    return this.scores;
  }
}
```

- 在需要用到依赖的地方进行声明
```js
import { Controller, Get } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller('scores')
export class ScoreController {
  constructor(private scoreService: ScoreService) {}

  @Get()
  async findAll(): Promise<number[]> {
    return this.scoreService.findAll();
  }
}
```

- 将依赖添加进 ioc 容器
```js
import { Module } from '@nestjs/common';
import { ScoreController } from './cats/score.controller';
import { ScoreService } from './cats/score.service';

@Module({
  controllers: [ScoreController],
  providers: [ScoreService],
})
export class AppModule {}
```

## 注册依赖的3种方式：useClass、useValue、useFactory
```js
@Module({
  controllers: [ScoreController],
  providers: [
    { // 方式一 useClass：注入 useClass 生成的实例，它的语法糖为直接写 [ScoreService] 而不是当前对象 
      provide: ScoreService,
      useClass: ScoreService,
    },
    { // 方式二 useValue：直接注入 useValue 的值
      provide: ScoreService,
      useValue: {
        findAll: () => [100, 90]
      }
    },

    {
      provide: 'nameToken',
      useValue: {name: 'xxx'},
    },
    { // 方式三 useFactory：注入工厂函数的返回值
      provide: ScoreService,
      useFactory (nameTokenInstance: {name: string}) {...},
      inject: ['nameToken'], // 添加依赖的 token 列表，它将通过 token 生成依赖对象，并传给 useFactory
    }
  ],
})
export class AppModule {}
```

## 标注依赖的2种的方式
```js
import { Controller, Get } from '@nestjs/common';
import { ScoreService } from './score.service';

@Controller('scores')
export class ScoreController {
  constructor(
    private scoreService: ScoreService, // 方式一：直接采用 ts 类型说明
    @Inject('nameToken') private nameInstance: {name: string} // 方式二：@Inject 标注依赖
  ) {}

  @Get()
  async findAll(): Promise<number[]> {
    console.log(this.nameInstance.name);
    return this.scoreService.findAll();
  }
}
```