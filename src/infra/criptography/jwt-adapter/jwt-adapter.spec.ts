import { JwtAdapter } from './jwt-adapter'
import jwt from 'jsonwebtoken'

interface ISut {
  sut: JwtAdapter
}

const makeSut = (): ISut => {
  const sut = new JwtAdapter('secret')
  return {
    sut
  }
}

describe('JwtAdapter', () => {
  it('Should call sign with correct values', async () => {
    const { sut } = makeSut()

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.generate('any_value')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_value' }, 'secret')
  })
})
