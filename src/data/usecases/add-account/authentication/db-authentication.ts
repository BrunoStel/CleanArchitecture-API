import { IAuthentication, IAuthenticationModel } from '../../../../domain/usecases/protocols/IAuthentication'
import { IHashComparer } from '../../protocols/IHashComparer'
import { IloadAccountByEmailRepository } from '../../protocols/IloadAccountByEmailRepository'
import { ITokenGenerator } from '../../protocols/ITokenGenerator'
import { IUpdateAccessTokenRepository } from '../../protocols/IUpdateAccessTokenRepository'

export class DbAuthentication implements IAuthentication {
  constructor (
    private readonly tokenGeneratorStub: ITokenGenerator,
    private readonly loadAccountByEmailRepository: IloadAccountByEmailRepository,
    private readonly hashCompare: IHashComparer,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGeneratorStub = tokenGeneratorStub
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async execute (authenticationModel: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email)

    if (!account) {
      return null
    }

    const { password: passwordHashed, id } = account

    const passwordComparison = await this.hashCompare.compare(authenticationModel.password, passwordHashed)

    if (!passwordComparison) {
      return null
    }

    const acessToken = await this.tokenGeneratorStub.generate(id)

    await this.updateAccessTokenRepository.updateToken(id, acessToken)

    return acessToken
  }
}
