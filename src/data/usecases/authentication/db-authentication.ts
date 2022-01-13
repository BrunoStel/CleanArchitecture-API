import { IAuthentication, IAuthenticationModel } from '../../../domain/usecases/protocols/IAuthentication'
import { IloadAccountByEmailRepository } from '../protocols/IloadAccountByEmailRepository'

export class DbAuthentication implements IAuthentication {
  constructor (private readonly loadAccountByEmailRepository: IloadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
  }

  async execute (authenticationModel: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)
    return account.email
  }
}
