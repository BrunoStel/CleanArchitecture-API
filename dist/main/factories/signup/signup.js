"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignupController = void 0;
const db_add_account_1 = require("../../../data/usecases/add-account/db-add-account");
const bcrypt_adapter_1 = require("../../../infra/criptography/bcryptadapter/bcrypt-adapter");
const account_1 = require("../../../infra/db/mongodb/account-repository/account");
const log_1 = require("../../../infra/db/mongodb/log-repository/log");
const signupController_1 = require("../../../presentation/controllers/signup/signupController");
const log_2 = require("../../decorators/log");
const signup_validation_1 = require("./signup-validation");
const makeSignupController = () => {
    const salt = 12;
    const bcryptAdapter = new bcrypt_adapter_1.BCryptAdapter(salt);
    const addAccountRepository = new account_1.AccountMongoRepository();
    const addAccount = new db_add_account_1.DbAddAccountUseCase(bcryptAdapter, addAccountRepository);
    const signupController = new signupController_1.SignupController(addAccount, (0, signup_validation_1.makeSignupValidation)());
    const logMongoRepository = new log_1.LogMongoRepository();
    return new log_2.LogControllerDecoretor(signupController, logMongoRepository);
};
exports.makeSignupController = makeSignupController;
//# sourceMappingURL=signup.js.map