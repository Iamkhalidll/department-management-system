import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { TypeORMError } from 'typeorm';

/**
 * Standardized error response structure
 */
interface ErrorResponse {
  message: string;
  code: string;
  timestamp: string;
  path?: string;
  details?: Record<string, any>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const context = gqlHost.getContext();
    const { req } = context;
    
    // Default values
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: Record<string, any> = {};

    // Extract operation name and path for better error context
    const path = req?.body?.operationName || 'unknown';

    // Handle different types of exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        // Extract message from response object
        message =
          Array.isArray((response as any).message)
            ? (response as any).message[0]
            : (response as any).message ?? message;
        
        // Extract error code or use HTTP status name
        code = (response as any).error ?? HttpStatus[status] ?? 'HTTP_EXCEPTION';
        
        // Include any additional details from the response
        if ((response as any).details) {
          details = (response as any).details;
        }
      } else {
        message = response as string;
        code = 'HTTP_EXCEPTION';
      }
      
      // Map common HTTP status codes to more specific error codes
      if (status === HttpStatus.BAD_REQUEST) {
        code = 'VALIDATION_ERROR';
      } else if (status === HttpStatus.UNAUTHORIZED) {
        code = 'AUTHENTICATION_ERROR';
      } else if (status === HttpStatus.FORBIDDEN) {
        code = 'AUTHORIZATION_ERROR';
      } else if (status === HttpStatus.NOT_FOUND) {
        code = 'RESOURCE_NOT_FOUND';
      }
      
    } else if (exception instanceof TypeORMError) {
      // Handle TypeORM specific errors with more detailed codes
      message = exception.message;
      
      if (exception.message.includes('duplicate')) {
        code = 'DATABASE_DUPLICATE_ENTRY';
        status = HttpStatus.CONFLICT;
      } else if (exception.message.includes('not found')) {
        code = 'DATABASE_ENTITY_NOT_FOUND';
        status = HttpStatus.NOT_FOUND;
      } else if (exception.message.includes('constraint')) {
        code = 'DATABASE_CONSTRAINT_VIOLATION';
        status = HttpStatus.BAD_REQUEST;
      } else {
        code = 'DATABASE_ERROR';
      }
      
    } else if (exception?.code === 'ECONNREFUSED' || exception?.code === 'ETIMEDOUT') {
      message = 'Database connection failed';
      code = 'DATABASE_CONNECTION_ERROR';
      status = HttpStatus.SERVICE_UNAVAILABLE;
      
    } else if (exception instanceof GraphQLError) {
      // Handle GraphQL specific errors
      message = exception.message;
      code = exception.extensions?.code as string || 'GRAPHQL_ERROR';
      if (exception.extensions?.http && typeof exception.extensions.http === 'object' && 'status' in exception.extensions.http) {
        status = (exception.extensions.http as { status: number }).status;
      }
      
    } else if (exception?.message) {
      message = exception.message;
      
      // Try to extract meaningful code from error name if available
      if (exception.name) {
        code = exception.name.replace(/Error$/, '').toUpperCase() + '_ERROR';
      }
    }

    // Include stack trace only in non-production environments
    const stacktrace =
      process.env.NODE_ENV === 'production'
        ? undefined
        : exception?.stack?.split?.('\n');

    // Create standardized error response
    const errorResponse: ErrorResponse = {
      message,
      code,
      timestamp: new Date().toISOString(),
      path,
      ...(Object.keys(details).length > 0 && { details }),
    };

    // Log the error with proper context
    this.logger.error(
      `[${code}] ${message} (${status}) at ${path}`,
      exception?.stack
    );

    // Return GraphQL error with consistent format
    throw new GraphQLError(message, {
      extensions: {
        code,
        http: { status: status },
        timestamp: errorResponse.timestamp,
        path: errorResponse.path,
        ...(Object.keys(details).length > 0 && { details }),
        ...(stacktrace && { exception: { stacktrace } }),
      },
    });
  }
}