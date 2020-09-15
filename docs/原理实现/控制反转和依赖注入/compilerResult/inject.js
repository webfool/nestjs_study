"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var INJECT_METADATA_KEY = 'INJECT_METADATA';
function Inject(token) {
    return function (target, key, index) {
        Reflect.defineMetadata(INJECT_METADATA_KEY, token, target, "index-" + index);
    };
}
exports.Inject = Inject;
function getInjectToken(target, index) {
    return Reflect.getMetadata(INJECT_METADATA_KEY, target, "index-" + index);
}
exports.getInjectToken = getInjectToken;
function Injectable(target) {
    target.isInjectable = true;
}
exports.Injectable = Injectable;
