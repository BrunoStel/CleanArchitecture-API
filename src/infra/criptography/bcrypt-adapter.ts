import { IHasher } from '../../data/protocols/criptography/IHasherProtocols'
import bcryptjs from 'bcryptjs'

export class BCryptAdapter implements IHasher {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const passwordHashed = await bcryptjs.hash(value, this.salt)
    return passwordHashed
  }
}
