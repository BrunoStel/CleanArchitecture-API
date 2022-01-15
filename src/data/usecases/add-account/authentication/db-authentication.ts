import { IAuthentication, IAuthenticationModel } from '../../../../domain/usecases/protocols/IAuthentication'
import { IHashComparer } from '../../protocols/IHashComparer'
import { IloadAccountByEmailRepository } from '../../protocols/IloadAccountByEmailRepository'
import { ITokenGenerator } from '../../protocols/ITokenGenerator'

export class DbAuthentication implements IAuthentication {
  constructor (
    private readonly tokenGeneratorStub: ITokenGenerator,
    private readonly loadAccountByEmailRepository: IloadAccountByEmailRepository,
    private readonly hashCompare: IHashComparer
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGeneratorStub = tokenGeneratorStub
  }

  async execute (authenticationModel: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)

    if (!account) {
      return null
    }

    const passwordComparison = await this.hashCompare.compare(authenticationModel.password, account.password)

    if (!passwordComparison) {
      return null
    }

    const acessToken = await this.tokenGeneratorStub.generate()

    return acessToken
  }
}
