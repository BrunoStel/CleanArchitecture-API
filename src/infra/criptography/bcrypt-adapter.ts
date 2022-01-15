import { IEncrypter } from '../../data/protocols/IEncrypterProtocols'
import bcryptjs from 'bcryptjs'

export class BCryptAdapter implements IEncrypter {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    const passwordHashed = await bcryptjs.hash(value, this.salt)
    return passwordHashed
  }
}
