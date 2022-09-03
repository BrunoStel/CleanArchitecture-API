"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginValidation = void 0;
const validator_1 = require("../../../presentation/helpers/validator/");
const email_validator_adapter_1 = require("../../adapter/validators/email-validator-adapter");
const makeLoginValidation = () => {
    const validations = [];
    for (const field of ['email', 'password']) {
        validations.push(new validator_1.RequiredFieldValidation(field));
    }
    validations.push(new validator_1.EmailValidation('email', new email_validator_adapter_1.EmailValidatorAdapter()));
    return new validator_1.ValidationComposite(validations);
};
exports.makeLoginValidation = makeLoginValidation;
//# sourceMappingURL=login-validation.js.map