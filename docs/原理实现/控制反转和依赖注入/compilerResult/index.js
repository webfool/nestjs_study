"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var container_1 = require("./container");
var inject_1 = require("./inject");
var types_1 = require("./types");
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
var FrontEnd = /** @class */ (function () {
    function FrontEnd() {
        this.frontendLang = ['js', 'html', 'css'];
    }
    return FrontEnd;
}());
var BackEnd = /** @class */ (function () {
    function BackEnd() {
        this.backendLang = ['java', 'mysql'];
    }
    return BackEnd;
}());
var Operation = /** @class */ (function () {
    function Operation() {
        this.operationLang = ['nginx', 'jenkins'];
    }
    return Operation;
}());
var Pm = /** @class */ (function () {
    function Pm() {
        this.pmLang = ['word', 'ppt'];
    }
    return Pm;
}());
var pmToken = new types_1.InjectToken('pmToken');
var Project = /** @class */ (function () {
    function Project(frontEnd, // useClass 的方式添加的 provider
    backEnd, // useValue 的方式添加的 provider
    operation, // useFactory 的方式添加的 provider
    pm // Inject 的方式添加的 provider
    ) {
        this.frontEnd = frontEnd;
        this.backEnd = backEnd;
        this.operation = operation;
        this.pm = pm;
    }
    Project = __decorate([
        inject_1.Injectable,
        __param(3, inject_1.Inject(pmToken)),
        __metadata("design:paramtypes", [FrontEnd,
            BackEnd,
            Operation,
            FrontEnd // Inject 的方式添加的 provider
        ])
    ], Project);
    return Project;
}());
var container = new container_1.default();
container.addProvide({ provide: FrontEnd, useClass: FrontEnd });
container.addProvide({ provide: BackEnd, useValue: new BackEnd() });
container.addProvide({ provide: Operation, useFactory: function () { return new Operation(); } });
container.addProvide({ provide: Project, useClass: Project });
container.addProvide({ provide: pmToken, useClass: Pm });
var project = container.inject(Project);
console.log('project ->', project);
