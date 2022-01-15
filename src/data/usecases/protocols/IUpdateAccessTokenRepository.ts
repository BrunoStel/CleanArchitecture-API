
export interface IUpdateAccessTokenRepository {
  updateToken: (acessToken: string, id: string) => Promise<void>
}
