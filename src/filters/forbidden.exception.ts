import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(status?: any) {
    super(
      'You are forbidden to access the endpoint',
      status ? status : HttpStatus.FORBIDDEN,
    );
  }
}
