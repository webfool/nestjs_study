"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var inject_1 = require("./inject");
var Container = /** @class */ (function () {
    function Container() {
        this.provides = new Map();
    }
    Container.prototype.addProvide = function (provider) {
        this.provides.set(provider.provide, provider);
    };
    Container.prototype.inject = function (token) {
        var _this = this;
        var provider = this.provides.get(token);
        if (provider === undefined) {
            throw new Error("no provider for " + this.getTokenName(token));
        }
        if (this.isClass(provider)) {
            var target_1 = provider.useClass;
            var paramTypes = Reflect.getMetadata('design:paramtypes', target_1) || [];
            var args = paramTypes.map(function (type, index) {
                var overrideToken = inject_1.getInjectToken(target_1, index);
                var actualToken = overrideToken || type;
                return _this.inject(actualToken);
            });
            return Reflect.construct(target_1, args);
        }
        else if (this.isValue(provider)) {
            return provider.useValue;
        }
        else if (this.isFactory(provider)) {
            return provider.useFactory();
        }
    };
    Container.prototype.isClass = function (provider) {
        return provider.useClass !== undefined;
    };
    Container.prototype.isValue = function (provider) {
        return provider.useValue !== undefined;
    };
    Container.prototype.isFactory = function (provider) {
        return provider.useFactory !== undefined;
    };
    Container.prototype.getTokenName = function (token) {
        return token instanceof types_1.InjectToken ? token.injectionIdentifier : token.name;
    };
    return Container;
}());
exports.default = Container;
