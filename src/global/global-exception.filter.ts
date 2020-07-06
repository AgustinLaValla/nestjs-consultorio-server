import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Error } from 'mongoose';
import { MongoError } from 'mongodb';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

    private logger = new Logger('Exceptions Filter');

    catch(exception:any, host:ArgumentsHost) {
        
        console.log(exception);
        const ctx = host.switchToHttp();

        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException ?  exception.getStatus() : 
                       exception instanceof Error.ValidationError ? 422 :
                       (exception instanceof MongoError && exception.code === 11000 && request.body.nombreEspecialidad) ? 422 : 
                       (exception instanceof MongoError && exception.code === 11000 && (request.body.servicioName || request.body.newValue)) ? 422 :
                       HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException && exception.message.indexOf('ocupado') < 0 ?  exception.message : 
                        exception instanceof HttpException  && exception.message.indexOf('ocupado') >= 0 ? exception.getResponse():
                        (exception instanceof Error.ValidationError && exception.message.includes('Mutual')) ? 'La mutual ya existe':
                        (exception instanceof Error.ValidationError && exception.message.includes('Especialidad')) ? 'La especialidad ya existe':
                        (exception instanceof MongoError && exception.code === 11000 && request.body.nombreEspecialidad) ? `La especialidad ${request.body.nombreEspecialidad} ya existe` :
                        (exception instanceof MongoError && exception.code === 11000 && (request.body.servicioName || request.body.newValue)) ? `El servicio ${exception['keyValue'].nombre} ya existe`
                        : 'Internal Server Error';


        this.throwLoggerError(exception,request);

        response.status(status).json({
            statusCode:status,
            timeStamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message
        });
    }

    throwLoggerError(exception:any, request:any) { 
        const message = exception instanceof HttpException && exception.message.indexOf('ocupado') >= 0  ? 
                        `It's seems there was an Error while creating or updating the appoiment: ${JSON.stringify(exception.getResponse())}. Data: ${JSON.stringify(request.body)}` 
                        : 'An error has ocurred';

        this.logger.error(message);
        
    };
}