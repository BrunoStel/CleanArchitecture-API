"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbAuthentication = void 0;
class DbAuthentication {
    constructor(tokenGenerator, loadAccountByEmailRepository, hashCompare, updateAccessTokenRepository) {
        this.tokenGenerator = tokenGenerator;
        this.loadAccountByEmailRepository = loadAccountByEmailRepository;
        this.hashCompare = hashCompare;
        this.updateAccessTokenRepository = updateAccessTokenRepository;
    }
    async execute(authenticationModel) {
        const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationModel.email);
        if (!account) {
            return null;
        }
        const { password: passwordHashed, id } = account;
        const isValid = await this.hashCompare.compare(authenticationModel.password, passwordHashed);
        if (!isValid) {
            return null;
        }
        const acessToken = await this.tokenGenerator.generate(id);
        await this.updateAccessTokenRepository.updateToken({ acessToken, id });
        return acessToken;
    }
}
exports.DbAuthentication = DbAuthentication;
//# sourceMappingURL=db-authentication.js.map