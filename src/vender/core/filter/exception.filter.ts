import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const errorResponse = {
            code: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message:
                exception['message']['error'] ||
                exception['response']['message'] ||
                null
            // status !== HttpStatus.INTERNAL_SERVER_ERROR
            //     ? exception['message']['error'] ||
            //       exception['response']['message'] ||
            //       null
            //     : exception
        };

        response.status(status).json(errorResponse);
    }
}
