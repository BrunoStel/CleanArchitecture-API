import { RequestHandler } from 'express'

export const cors: RequestHandler = (request, response, next): void => {
  response.set('acess-control-allow-origin', '*')
  response.set('acess-control-allow-methods', '*')
  response.set('acess-control-allow-headers', '*')
  next()
}
