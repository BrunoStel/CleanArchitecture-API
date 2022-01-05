import { IAddAccount, IAddAccountModel, IAccountModel, IEncrypter } from './db-add-account-Protocols'

export class DbAddAccount implements IAddAccount {
  constructor (private readonly encrypter: IEncrypter) {
    this.encrypter = encrypter
  }

  async add (account: IAddAccountModel): Promise<IAccountModel> {
    const { name, email, password } = account

    await this.encrypter.encrypt(password)

    const accountCreated = {
      id: 'valid_id',
      name: name,
      email: email,
      password: password
    }

    return accountCreated
  }
}
