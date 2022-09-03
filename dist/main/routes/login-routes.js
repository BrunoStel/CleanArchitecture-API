"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_route_adapter_1 = require("../adapter/express/express-route-adapter");
const login_1 = require("../factories/login/login");
const signup_1 = require("../factories/signup/signup");
exports.default = (router) => {
    const signupController = (0, signup_1.makeSignupController)();
    router.post('/signup', (0, express_route_adapter_1.adaptRoute)(signupController));
    const loginController = (0, login_1.makeLoginController)();
    router.post('/login', (0, express_route_adapter_1.adaptRoute)(loginController));
    router.get('/healthy', (req, res) => {
        res.sendStatus(200);
    });
};
//# sourceMappingURL=login-routes.js.map