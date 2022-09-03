"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissinParamError = void 0;
class MissinParamError extends Error {
    constructor(paramName) {
        super(`Missing param: ${paramName}`);
        this.name = `MissinParamERROR: ${paramName}`;
    }
}
exports.MissinParamError = MissinParamError;
//# sourceMappingURL=missing-param-error.js.map