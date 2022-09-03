"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const http_helper_1 = require("../../helpers/http/http-helper");
class LoginController {
    constructor(authentication, validation) {
        this.authentication = authentication;
        this.validation = validation;
    }
    async handle(httpRequest) {
        try {
            const error = this.validation.validate(httpRequest.body);
            if (error) {
                return (0, http_helper_1.badRequest)(error);
            }
            const token = await this.authentication.execute(httpRequest.body);
            if (!token) {
                return (0, http_helper_1.unauthorized)();
            }
            return (0, http_helper_1.ok)({ acessToken: token });
        }
        catch (error) {
            return (0, http_helper_1.serverError)(error);
        }
    }
}
exports.LoginController = LoginController;
//# sourceMappingURL=login.js.map