import { IAddAccount, IAddAccountModel, IAccountModel, IEncrypter, IAddAccountRepository } from './db-add-account-Protocols'

export class DbAddAccount implements IAddAccount {
  constructor (
    private readonly encrypter: IEncrypter,
    private readonly addAccountRepository: IAddAccountRepository) {
    this.encrypter = encrypter
    this.addAccountRepository = addAccountRepository
  }

  async add (account: IAddAccountModel): Promise<IAccountModel> {
    const { name, email, password } = account

    const passwordHashed = await this.encrypter.encrypt(password)

    const accountCreated = await this.addAccountRepository.add({
      name,
      email,
      password: passwordHashed
    })

    return accountCreated
  }
}
