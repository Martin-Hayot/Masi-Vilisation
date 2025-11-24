/**
 * Base application error class that extends Error with HTTP status code support.
 * All custom application errors should extend this class.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly to fix instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * 400 Bad Request - The request was invalid or cannot be served.
 */
export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request', code: string = 'BAD_REQUEST') {
    super(message, 400, code);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

/**
 * 401 Unauthorized - The request requires authentication.
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    super(message, 401, code);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * 403 Forbidden - The server understood the request but refuses to authorize it.
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', code: string = 'FORBIDDEN') {
    super(message, 403, code);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * 404 Not Found - The requested resource could not be found.
 */
export class NotFoundError extends AppError {
  constructor(
    message: string = 'Resource not found',
    code: string = 'NOT_FOUND',
  ) {
    super(message, 404, code);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * 409 Conflict - The request could not be completed due to a conflict with the current state.
 */
export class ConflictError extends AppError {
  constructor(message: string = 'Conflict', code: string = 'CONFLICT') {
    super(message, 409, code);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * 422 Unprocessable Entity - The request was well-formed but contains semantic errors.
 */
export class UnprocessableEntityError extends AppError {
  constructor(
    message: string = 'Unprocessable Entity',
    code: string = 'UNPROCESSABLE_ENTITY',
  ) {
    super(message, 422, code);
    Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
  }
}

/**
 * 500 Internal Server Error - A generic error occurred on the server.
 */
export class InternalServerError extends AppError {
  constructor(
    message: string = 'Internal Server Error',
    code: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(message, 500, code);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }
}

/**
 * 503 Service Unavailable - The server is temporarily unavailable.
 */
export class ServiceUnavailableError extends AppError {
  constructor(
    message: string = 'Service Unavailable',
    code: string = 'SERVICE_UNAVAILABLE',
  ) {
    super(message, 503, code);
    Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
  }
}
