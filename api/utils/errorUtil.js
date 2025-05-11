/**
 * Custom error class for handling application errors
 * @class ErrorUtil
 * @extends Error
 */
class ErrorUtil extends Error {
    /**
     * Creates a new ErrorUtil instance
     * @param {string} message - The error message
     * @param {number} [statusCode=500] - The HTTP status code
     */
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }

    /**
     * Handles error responses in a consistent format
     * @param {Error|ErrorUtil} error - The error to handle
     * @param {Object} res - Express response object
     * @returns {Object} Formatted error response
     */
    static handle(error, res) {
        if (error instanceof ErrorUtil) {
            return res.status(error.statusCode).json({
                status: error.status,
                message: error.message,
                code: error.statusCode
            });
        }

        // Log unexpected errors
        console.error('Unexpected error:', error);

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
            code: 500,
        });
    }

    /**
     * Creates a 400 Bad Request error
     * @param {string} message - The error message
     * @returns {ErrorUtil} A new ErrorUtil instance
     */
    static badRequest(message) {
        return new ErrorUtil(`Bad Request: ${message}`, 400);
    }

    /**
     * Creates a 401 Unauthorized error
     * @param {string} message - The error message
     * @returns {ErrorUtil} A new ErrorUtil instance
     */
    static unauthorized(message) {
        return new ErrorUtil(`Unauthorized: ${message}`, 401);
    }

    /**
     * Creates a 403 Forbidden error
     * @param {string} message - The error message
     * @returns {ErrorUtil} A new ErrorUtil instance
     */
    static forbidden(message) {
        return new ErrorUtil(`Forbidden: ${message}`, 403);
    }

    /**
     * Creates a 404 Not Found error
     * @param {string} message - The error message
     * @returns {ErrorUtil} A new ErrorUtil instance
     */
    static notFound(message) {
        return new ErrorUtil(`Not Found: ${message}`, 404);
    }

    /**
     * Creates a 405 Method Not Allowed error
     * @returns {ErrorUtil} A new ErrorUtil instance
     */
    static methodNotAllowed() {
        return new ErrorUtil('Method Not Allowed', 405);
    }

    /**
     * Creates a 500 Internal Server Error
     * @param {string} message - The error message
     * @returns {ErrorUtil} A new ErrorUtil instance
     */
    static internal(message) {
        return new ErrorUtil(`Internal Server Error: ${message}`, 500);
    }

    /**
     * Creates a 503 Service Unavailable error
     * @param {string} message - The error message
     * @returns {ErrorUtil} A new ErrorUtil instance
     */
    static serviceUnavailable(message) {
        return new ErrorUtil(`Service Unavailable: ${message}`, 503);
    }

    /**
     * Creates a 504 Gateway Timeout error
     * @param {string} message - The error message
     * @returns {ErrorUtil} A new ErrorUtil instance
     */
    static gatewayTimeout(message) {
        return new ErrorUtil(`Gateway Timeout: ${message}`, 504);
    }
}

module.exports = ErrorUtil; 