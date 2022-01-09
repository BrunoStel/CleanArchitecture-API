export class ServerError extends Error {
  constructor (stackError: string) {
    super('Internal Server ERROR')
    this.name = 'ServerError'
    this.stack = stackError
  }
}
