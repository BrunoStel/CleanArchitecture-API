export class ServerError extends Error {
  constructor () {
    super('Internal Server ERROR')
    this.name = 'ServerError'
  }
}
