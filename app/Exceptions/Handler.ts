/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Logger from "@ioc:Adonis/Core/Logger";
import HttpExceptionHandler from "@ioc:Adonis/Core/HttpExceptionHandler";

export default class ExceptionHandler extends HttpExceptionHandler {
  protected context(ctx: HttpContextContract) {
    return {
      userId: ctx.auth.user?.id,
    };
  }
  protected statusPages = {
    "404": "errors/not-found",
    "500..599": "errors/server-error",
  };
  constructor() {
    super(Logger);
  }
  public async handle(error: any, ctx: HttpContextContract) {
    /**
     * Self handle the validation exception
     */
    // console.log('handling exceptions: ', error.code);

    const IS_API_URL = ctx.request.url().includes("api");
    const request = ctx.request;
    const response = ctx.response;

    if (error.code === "E_ROUTE_NOT_FOUND") {
      return IS_API_URL
        ? response.status(200).json({
            status: false,
            message: `${request.url()} does not exist.`,
          })
        : super.handle(error, ctx);
    }
    if (error.code === "ER_NO_DEFAULT_FOR_FIELD") {
      return response.status(IS_API_URL ? 200 : 400).json({
        status: false,
        message: `${error.sqlMessage}`,
      });
    }
    if (error.code === "ER_DATA_TOO_LONG") {
      return response.status(IS_API_URL ? 200 : 400).json({
        status: false,
        message: `${error.sqlMessage}`,
      });
    }
    if (error.code === "E_ROW_NOT_FOUND") {
      return response.status(IS_API_URL ? 200 : 400).json({
        status: false,
        message: `Id Not Found.`,
      });
    }
    if (error.code === "E_VALIDATION_FAILURE") {
      if (IS_API_URL)
        return response.status(200).json({
          status: false,
          message: error.messages?.errors.toString(),
        });
      // if (ctx.request.url().includes("admin/login"))
      //   return ctx.response.send("login", {
      //     // error: 'Please provid valid data.',
      //     error: "Please enter valid email id and password.",
      //   });
      return response.status(400).json({
        status: false,
        message: error.messages?.errors.toString(),
      });
    }
    /**
     * Forward rest of the exceptions to the parent class
     */
    return super.handle(error, ctx);
  }
}
