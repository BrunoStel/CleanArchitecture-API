import { IAuthentication, IAuthenticationModel } from '../../../../domain/usecases/protocols/IAuthentication'
import { IHashComparer } from '../../protocols/IHashComparer'
import { IloadAccountByEmailRepository } from '../../protocols/IloadAccountByEmailRepository'

export class DbAuthentication implements IAuthentication {
  constructor (
    private readonly loadAccountByEmailRepository: IloadAccountByEmailRepository,
    private readonly hashCompare: IHashComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
  }

  async execute (authenticationModel: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)

    if (!account) {
      return null
    }

    await this.hashCompare.compare(authenticationModel.password, account.password)
  }
}
