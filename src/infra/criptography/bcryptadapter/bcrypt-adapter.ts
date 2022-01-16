import { IHasher } from '../../../data/protocols/criptography/IHasherProtocols'
import bcryptjs from 'bcryptjs'
import { IHashComparer } from '../../../data/protocols/criptography/IHashComparer'

export class BCryptAdapter implements IHasher, IHashComparer {
  constructor (private readonly salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const passwordHashed = await bcryptjs.hash(value, this.salt)
    return passwordHashed
  }

  async compare (value: string, hash: string): Promise<boolean> {
    const isValid = await bcryptjs.compare(value, hash)
    return isValid
  }
}
