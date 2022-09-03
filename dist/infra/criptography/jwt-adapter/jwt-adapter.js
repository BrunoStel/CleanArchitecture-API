"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAdapter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtAdapter {
    constructor(secretKey) {
        this.secretKey = secretKey;
    }
    async generate(value) {
        const acessToken = jsonwebtoken_1.default.sign({ id: value }, this.secretKey);
        return acessToken;
    }
}
exports.JwtAdapter = JwtAdapter;
//# sourceMappingURL=jwt-adapter.js.map