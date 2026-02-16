export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOp: boolean;

    constructor(message: string, statusCode: number, isOp: boolean = true) {
        super(message);

        this.statusCode = statusCode;
        this.isOp = isOp;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(
        message = "Bad Request",
        public details?: Record<string, any>
    ) {
        super(message, 400, true);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401, true);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403, true);
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, 404, true);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict") {
        super(message, 409, true);
    }
}

export class ValidationError extends BadRequestError {
    constructor(details: Record<string, any>) {
        super("Validation failed", { details });
    }
}

export class InternalServerError extends AppError {
    constructor(message = "Internal Server Error") {
        super(message, 500, false);
    }
}

export class NotificationError extends AppError {
    constructor(message = "Notification failed") {
        super(message, 502, false);
    }
}

// TEMP
export class UserVerificationError extends AppError {
    constructor(message = "User verification error"){
        super(message, 400, true);
    }
}