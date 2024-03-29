"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = exports.serverError = exports.unauthorized = exports.badRequest = void 0;
const errors_1 = require("../../errors");
const server_error_1 = require("../../errors/server-error");
const badRequest = (error) => ({
    statusCode: 400,
    body: error
});
exports.badRequest = badRequest;
const unauthorized = () => ({
    statusCode: 401,
    body: new errors_1.UnauthorizedError()
});
exports.unauthorized = unauthorized;
const serverError = (error) => ({
    statusCode: 500,
    body: new server_error_1.ServerError(error.stack)
});
exports.serverError = serverError;
const ok = (data) => ({
    statusCode: 200,
    body: data
});
exports.ok = ok;
//# sourceMappingURL=http-helper.js.map