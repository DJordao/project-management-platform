export interface ILoginRequest {
  username: string,
  password: string,
  rememberMe: boolean
}

export interface ILoginResult {
  username: string,
  role: string
}
