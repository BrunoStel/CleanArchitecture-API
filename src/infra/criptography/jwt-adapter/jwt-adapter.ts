import jwt from 'jsonwebtoken'
import { ITokenGenerator } from '../../../data/protocols/criptography/ITokenGenerator'

export class JwtAdapter implements ITokenGenerator {
  constructor (private readonly secretKey: string) {
    this.secretKey = secretKey
  }

  async generate (value: string): Promise<string> {
    jwt.sign({ id: value }, this.secretKey)
    return null
  }
}
