import { HttpStatus } from '@nestjs/common';

export const responseStatus = {
  success: true,
  fail: false,
};

export const errorDefinition = {
  NOT_FOUND: 'Record not found',
  SERVER_ERROR: 'Internal server error',
  BAD_REQUEST: 'Invalid request sent',
  UNIQUE: 'Record already exist',
};

export class Exceptions {
  static getResponse(code: string) {
    let status: any;
    switch (code) {
      case 'P2000':
        status = {
          statusCode: HttpStatus.BAD_REQUEST,
          message: errorDefinition.BAD_REQUEST,
          status: responseStatus.fail,
        };
        break;
      case 'P2002':
        status = {
          statusCode: HttpStatus.CONFLICT,
          message: errorDefinition.UNIQUE,
          status: responseStatus.fail,
        };
        break;
      case 'P2025':
        status = {
          statusCode: HttpStatus.NOT_FOUND,
          message: errorDefinition.NOT_FOUND,
          status: responseStatus.fail,
        };
        break;
      default:
        status = {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: errorDefinition.SERVER_ERROR,
          status: responseStatus.fail,
        };
        break;
    }
    return status;
  }
}
