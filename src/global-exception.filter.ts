import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      // timestamp: new Date().toISOString(),
      // path: httpAdapter.getRequestUrl(request),
      message:
        exception instanceof HttpException
          ? exception.getResponse()['message'] || exception.message
          : 'Ha ocurrido un error interno en el servidor.',
    };

    this.logger.error(
      `${httpStatus} ${httpAdapter.getRequestUrl(request)}`,
      exception instanceof HttpException ? exception.stack : String(exception),
    );

    if (process.env.NODE_ENV === 'development') {
      responseBody['stack'] =
        exception instanceof HttpException
          ? exception.stack
          : String(exception);
    }

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
