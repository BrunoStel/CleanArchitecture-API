import { LoginController } from './login'

interface ISut {
  sut: LoginController
}
const makeSut = (): ISut => {
  const sut = new LoginController()
  return {
    sut
  }
}

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body.name).toEqual('MissinParamERROR: email')
  })
})
