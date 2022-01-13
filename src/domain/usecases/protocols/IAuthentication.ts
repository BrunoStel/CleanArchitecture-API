export interface IAuthenticationModel{
  email: string
  password: string
}

export interface IAuthentication {
  execute: (authenticationModel: IAuthenticationModel) => Promise<string>
}
