"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbAddAccountUseCase = void 0;
class DbAddAccountUseCase {
    constructor(hasher, addAccountRepository) {
        this.hasher = hasher;
        this.addAccountRepository = addAccountRepository;
    }
    async execute(accountData) {
        const passwordHashed = await this.hasher.hash(accountData.password);
        const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: passwordHashed }));
        return account;
    }
}
exports.DbAddAccountUseCase = DbAddAccountUseCase;
//# sourceMappingURL=db-add-account.js.map