import { TransformFnParams } from 'class-transformer'

export const transformToLowerCaseCallback = (params: TransformFnParams) =>
  params.value.toLowerCase()
