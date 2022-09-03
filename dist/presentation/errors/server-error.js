"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
class ServerError extends Error {
    constructor(stackError) {
        super('Internal Server ERROR');
        this.name = 'ServerError';
        this.stack = stackError;
    }
}
exports.ServerError = ServerError;
//# sourceMappingURL=server-error.js.map