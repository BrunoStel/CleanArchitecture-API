
export interface ITokenGenerator {
  generate: () => Promise<string>
}
