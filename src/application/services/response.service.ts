export type T_Response = {
  error: boolean;
  statusCode: number;
  message: string;
  payload: any;
};

export default class ResponseService {
  SuccessResponse(
    message: string = "Success",
    payload: any = null
  ): T_Response {
    return {
      error: false,
      statusCode: 200,
      message,
      payload,
    };
  }

  CreatedResponse(
    message: string = "Resource created successfully",
    payload: any = null
  ): T_Response {
    return {
      error: false,
      statusCode: 201,
      message,
      payload,
    };
  }

  BadRequestException(
    message: string = "Bad request exception",
    payload: any = null
  ): T_Response {
    return {
      error: true,
      statusCode: 400,
      message,
      payload,
    };
  }

  UnauthorizedException(
    message: string = "Unauthorized exception",
    payload: any = null
  ): T_Response {
    return {
      error: true,
      statusCode: 401,
      message,
      payload,
    };
  }

  ForbiddenException(
    message: string = "Forbidden exception",
    payload: any = null
  ): T_Response {
    return {
      error: true,
      statusCode: 403,
      message,
      payload,
    };
  }

  NotFoundException(
    message: string = "Not found exception",
    payload: any = null
  ): T_Response {
    return {
      error: true,
      statusCode: 404,
      message,
      payload,
    };
  }

  InternalServerErrorException(
    message: string = "Internal server error",
    payload: any = null
  ): T_Response {
    return {
      error: true,
      statusCode: 500,
      message,
      payload,
    };
  }
}
