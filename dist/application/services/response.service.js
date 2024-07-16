"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseService {
    SuccessResponse(message = "Success", payload = null) {
        return {
            error: false,
            statusCode: 200,
            message,
            payload,
        };
    }
    CreatedResponse(message = "Resource created successfully", payload = null) {
        return {
            error: false,
            statusCode: 201,
            message,
            payload,
        };
    }
    BadRequestException(message = "Bad request exception", payload = null) {
        return {
            error: true,
            statusCode: 400,
            message,
            payload,
        };
    }
    UnauthorizedException(message = "Unauthorized exception", payload = null) {
        return {
            error: true,
            statusCode: 401,
            message,
            payload,
        };
    }
    ForbiddenException(message = "Forbidden exception", payload = null) {
        return {
            error: true,
            statusCode: 403,
            message,
            payload,
        };
    }
    NotFoundException(message = "Not found exception", payload = null) {
        return {
            error: true,
            statusCode: 404,
            message,
            payload,
        };
    }
    InternalServerErrorException(message = "Internal server error", payload = null) {
        return {
            error: true,
            statusCode: 500,
            message,
            payload,
        };
    }
}
exports.default = ResponseService;
