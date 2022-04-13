import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { IErrorResponse } from 'common/interfaces'
import { CommonErrors, ResponseErrorTypeEnum } from '../common'
import { Response } from 'express'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const exceptionBody: any = exception.getResponse()

    if (Object.values(CommonErrors).includes(exceptionBody.message)) {
      const commonValidationErrorResponse: IErrorResponse = {
        error: {
          common: [exceptionBody.message],
        },
      }

      return response
        .status(exception.getStatus())
        .send(commonValidationErrorResponse)
    }

    if (exceptionBody.type === ResponseErrorTypeEnum.SCHEMA_VALIDATION_ERROR) {
      const schemaValidationErrorResponse: IErrorResponse = {
        error: {
          properties: exceptionBody.errors.map(error => ({
            property: error.property,
            errors: error.validationMessages,
          })),
        },
      }

      return response
        .status(exception.getStatus())
        .send(schemaValidationErrorResponse)
    }

    const defaultValidationErrorResponse: IErrorResponse = {
      error: {
        properties: [
          {
            property: exceptionBody.property,
            errors: [exceptionBody.message],
          },
        ],
      },
    }

    return response
      .status(exception.getStatus())
      .send(defaultValidationErrorResponse)
  }
}
