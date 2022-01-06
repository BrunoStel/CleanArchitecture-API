import { Request, RequestHandler, Response } from 'express'
import { IController, IHttpRequest } from '../../presentation/protocols'

export const adaptRoute = (controller: IController): RequestHandler => {
  return async (request: Request, response: Response) => {
    const httpRequest: IHttpRequest = {
      body: request.body
    }
    const httpReponse = await controller.handle(httpRequest)

    response.status(httpReponse.statusCode).json(httpReponse.body)
  }
}
