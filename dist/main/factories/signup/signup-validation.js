"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSignupValidation = void 0;
const validator_1 = require("../../../presentation/helpers/validator/");
const email_validator_adapter_1 = require("../../adapter/validators/email-validator-adapter");
const makeSignupValidation = () => {
    const validations = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
        validations.push(new validator_1.RequiredFieldValidation(field));
    }
    validations.push(new validator_1.CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new validator_1.EmailValidation('email', new email_validator_adapter_1.EmailValidatorAdapter()));
    return new validator_1.ValidationComposite(validations);
};
exports.makeSignupValidation = makeSignupValidation;
//# sourceMappingURL=signup-validation.js.map