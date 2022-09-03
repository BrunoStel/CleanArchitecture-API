"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompareFieldsValidation = void 0;
const errors_1 = require("../../errors");
class CompareFieldsValidation {
    constructor(fieldName, fieldToComparename) {
        this.fieldName = fieldName;
        this.fieldToComparename = fieldToComparename;
    }
    validate(input) {
        if (input[this.fieldName] !== input[this.fieldToComparename]) {
            return new errors_1.InvalidParamError(this.fieldToComparename);
        }
        return null;
    }
}
exports.CompareFieldsValidation = CompareFieldsValidation;
//# sourceMappingURL=compare-fields-validation.js.map