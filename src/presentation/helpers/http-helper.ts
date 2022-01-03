import { IHttpResponse } from '../protocols/IHtpp'

export const badRequest = (error: Error): IHttpResponse => (
  {
    statusCode: 400,
    body: error
  }
)
