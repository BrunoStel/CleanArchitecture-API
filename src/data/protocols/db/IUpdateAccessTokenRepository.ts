export interface IUpdateTokenInput {
  acessToken: string
  id: string
}

export interface IUpdateAccessTokenRepository {
  updateToken: ({ acessToken, id }: IUpdateTokenInput) => Promise<void>
}
