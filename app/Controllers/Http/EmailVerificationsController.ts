import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";

export default class EmailVerificationsController {
  public async confirm({ response, params, request }: HttpContextContract) {
    const user: any = await User.findBy("email_verify_token", params.token);

    if (!user) {
      return response.json({ status: false, message: "Invalid token" });
    } else if (user.is_verified) {
      return response.json({
        status: true,
        message: "Account has been already verified..please Login!",
      });
    }
    // user.rememberMeToken = null;
    user.is_verified = true;

    await user.save();

    return response.json({
      status: true,
      message: "Your account has been successfully verified",
    });
  }
}
