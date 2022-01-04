import { IHttpRequest, IHttpResponse } from './IHtpp'

export interface IController {
  handle: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
}
