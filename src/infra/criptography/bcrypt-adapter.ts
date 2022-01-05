import { IEncrypter } from '../../data/usecases/protocols/IEncrypterProtocols'
import bcryptjs from 'bcryptjs'

export class BCryptAdapter implements IEncrypter {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    await bcryptjs.hash(value, this.salt)
    return value
  }
}
