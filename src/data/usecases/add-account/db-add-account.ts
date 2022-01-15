import { IAddAccount, IAddAccountModel, IAccountModel, IHasher, IAddAccountRepository } from './db-add-account-Protocols'

export class DbAddAccountUseCase implements IAddAccount {
  constructor (
    private readonly hasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository) {
    this.hasher = hasher
    this.addAccountRepository = addAccountRepository
  }

  async execute (accountData: IAddAccountModel): Promise<IAccountModel> {
    const passwordHashed = await this.hasher.hash(accountData.password)

    const account = await this.addAccountRepository.add(Object.assign({}, accountData, { password: passwordHashed }))

    return account
  }
}
