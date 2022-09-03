"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCryptAdapter = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class BCryptAdapter {
    constructor(salt) {
        this.salt = salt;
    }
    async hash(value) {
        const passwordHashed = await bcryptjs_1.default.hash(value, this.salt);
        return passwordHashed;
    }
    async compare(value, hash) {
        const isValid = await bcryptjs_1.default.compare(value, hash);
        return isValid;
    }
}
exports.BCryptAdapter = BCryptAdapter;
//# sourceMappingURL=bcrypt-adapter.js.map