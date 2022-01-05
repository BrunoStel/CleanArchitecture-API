import { IAddAccount, IAddAccountModel, IAccountModel, IEncrypter, IAddAccountRepository } from './db-add-account-Protocols'

export class DbAddAccount implements IAddAccount {
  constructor (
    private readonly encrypter: IEncrypter,
    private readonly addAccountRepository: IAddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const passwordHashed = await this.encrypter.encrypt(accountData.password)

    const accountCreated = await this.addAccountRepository.add(Object.assign({}, accountData, { password: passwordHashed }))

    return accountCreated
  }
}
