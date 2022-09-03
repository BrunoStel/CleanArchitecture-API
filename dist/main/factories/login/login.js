"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginController = void 0;
const env_1 = __importDefault(require("../../config/env"));
const db_authentication_1 = require("../../../data/usecases/authentication/db-authentication");
const bcrypt_adapter_1 = require("../../../infra/criptography/bcryptadapter/bcrypt-adapter");
const jwt_adapter_1 = require("../../../infra/criptography/jwt-adapter/jwt-adapter");
const account_1 = require("../../../infra/db/mongodb/account-repository/account");
const log_1 = require("../../../infra/db/mongodb/log-repository/log");
const login_1 = require("../../../presentation/controllers/login/login");
const log_2 = require("../../decorators/log");
const login_validation_1 = require("./login-validation");
const makeLoginController = () => {
    const salt = 12;
    const tokenGenerator = new jwt_adapter_1.JwtAdapter(env_1.default.jwtSecret);
    const accountMongoRepository = new account_1.AccountMongoRepository();
    const hashCompare = new bcrypt_adapter_1.BCryptAdapter(salt);
    const authentication = new db_authentication_1.DbAuthentication(tokenGenerator, accountMongoRepository, hashCompare, accountMongoRepository);
    const loginController = new login_1.LoginController(authentication, (0, login_validation_1.makeLoginValidation)());
    const logMongoRepository = new log_1.LogMongoRepository();
    return new log_2.LogControllerDecoretor(loginController, logMongoRepository);
};
exports.makeLoginController = makeLoginController;
//# sourceMappingURL=login.js.map