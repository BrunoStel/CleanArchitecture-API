export interface IUpdateToken {
  acessToken: string
  id: string
}

export interface IUpdateAccessTokenRepository {
  updateToken: ({ acessToken, id }: IUpdateToken) => Promise<void>
}
