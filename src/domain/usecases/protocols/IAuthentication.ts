export interface IAuthenticationModel{
  email: string
  password: string
}

export interface IAuthentication {
  auth: (authenticationModel: IAuthenticationModel) => Promise<string>
}
