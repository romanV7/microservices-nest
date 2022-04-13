interface IErrorObject {
  property: string
  errors: string[]
}

interface IError {
  common?: string[]
  properties?: IErrorObject[]
}

export interface IErrorResponse {
  error: IError
}
