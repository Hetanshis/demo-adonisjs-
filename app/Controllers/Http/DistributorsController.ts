import Mail from "@ioc:Adonis/Addons/Mail";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Distributor from "App/Models/Distributor";
import DistributorValidator, {
  ChangePasswordValidator,
  DistLoginValidator,
  DistributorUpdateValidator,
} from "App/Validators/DistributorValidator";
import Env from "@ioc:Adonis/Core/Env";
import DistriResetPasswordValidator from "App/Validators/DistriResetPasswordValidator";
import Hash from "@ioc:Adonis/Core/Hash";

export default class DistributorsController {
  public async create({ request, response, auth }: HttpContextContract) {
    const data: any = await request.validate(DistributorValidator);

    const existingDistributor = await Distributor.findBy("email", data.email);
    if (existingDistributor) {
      return response.json({
        status: false,
        message: "Email is already exist",
      });
    }

    const distributor: any = await Distributor.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });
    const token = await auth.use("dist").attempt(data.email, data.password);
    distributor.email_verify_token = token.token;
    await distributor.save();

    await Mail.use("smtp").send(
      (message) => {
        message
          .to("hetanshi@yopmail.com")
          .from(Env.get("SMTP_USERNAME"))
          .subject("Welcome Onboard Distributor!")
          .html(
            "<p>Please click on the following link to verify your email address:</p>" +
              '<a href="http://127.0.0.1:3333/api/distributor/verify-email' +
              token.token +
              '">http://127.0.0.1:3333/api/distributor/verify-email' +
              token.token +
              "</a>"
          );
      },
      {
        transaction: true,
        openTracking: false,
      }
    );
    if (!distributor) {
      return response.json({
        message: "Distributor can`t registered successfully",
      });
    }

    return response.json({
      status: true,
      message: "Distributor registered successfully",
      emailVerify: token,
    });
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const validate: any = await request.validate(DistLoginValidator);

    const distributor = await Distributor.findBy("email", validate.email);

    if (!distributor) {
      return response.json({ status: false, message: "Invalid email" });
    }

    if (!distributor.password) {
      return response.json({
        status: false,
        message: "Password does not exist",
      });
    }

    if (!distributor.is_verified) {
      return response.json({
        status: false,
        message: "Your Email has not verify... Please resend",
      });
    }

    const token = await auth
      .use("dist")
      .attempt(validate.email, validate.password, { expiresIn: "1h" });

    return response.json({
      status: true,
      message: "Distributor Login Successfully",
      token,
    });
  }

  public async emailVerify({ request, response }: HttpContextContract) {
    const token = request.input("token");
    const distributor = await Distributor.findBy("email_verify_token", token);

    if (!distributor) {
      return response.json({ status: false, message: "Invalid token" });
    } else if (distributor.is_verified) {
      return response.json({
        status: false,
        message: "Account has been already verified..please Login!",
      });
    } else {
      distributor.is_verified = true;
      await distributor.save();
      return response.json({
        status: true,
        message: "Your account has been successfully verified",
      });
    }
  }
  public async forgotPassword({
    response,

    params,
  }: HttpContextContract) {
    const dist = await Distributor.findBy("email", params.email);

    if (!dist) {
      return response.json({ message: "Invalid email" });
    }
    await Mail.use("smtp").send(
      (message) => {
        message
          .to("hetanshi@yopmail.com")
          .from(Env.get("SMTP_USERNAME"))
          .subject("Welcome Onboard!")
          .html(
            "<p>Please click on the following link to verify your email address:</p>" +
              '<a href="http://127.0.0.1:3333/api/admin/auth/forgot-password/' +
              params.email +
              '">http://127.0.0.1:3333/api/admin/auth/forgot-password/' +
              params.email +
              "</a>"
          );
      },
      {
        transaction: true,
        openTracking: false,
      }
    );
    return response.json({ status: true, message: "Email sent Successfully" });
  }

  public async resetPassword({
    request,
    response,
    params,
  }: HttpContextContract) {
    const email = params.email;

    const dist: any = await Distributor.findBy("email", email);

    if (!dist) {
      return response.json({ status: false, message: "Invalid email" });
    }

    const { password } = await request.validate(DistriResetPasswordValidator);
    dist.password = password;
    await dist.save();
    return response.json({
      status: true,
      message: "Distributor Password Reset successfully",
    });
  }

  // -----------------------------Profile_-------------------------------------------------
  public async getProfile({ response, auth }: HttpContextContract) {
    const distributor = await auth.use("dist").authenticate();
    if (!distributor) {
      return response.json({ message: "Distributor does not exist" });
    }
    return response.json({
      status: true,
      message: "Distributor get profile successfully",
      distributor,
    });
  }

  public async updateProfile({ request, response, auth }: HttpContextContract) {
    await auth.use("dist").authenticate();

    const data = await request.validate(DistributorUpdateValidator);
    const distributor = await Distributor.query().update({
      name: data.name,
      email: data.email,
    });

    if (!distributor) {
      return response.json({ message: "Distributor can`t update profile" });
    }

    return response.json({ message: "Distributor Update successfully" });
  }

  public async deleteProfile({ response, auth }: HttpContextContract) {
    await auth.use("dist").authenticate();

    const distributor = await Distributor.query().delete();

    if (!distributor) {
      return response.json({ message: "Distributor can`t delete profile" });
    }

    return response.json({ message: "Distributor deleted successfully" });
  }

  public async changePassword({
    request,
    response,
    auth,
  }: HttpContextContract) {
    const distributor = await auth.use("dist").authenticate();
    const validate = await request.validate(ChangePasswordValidator);

    const isValidPassword = await Hash.verify(
      distributor.password,
      validate.old_password
    );

    if (!isValidPassword) {
      return response.json({ message: "Please Enter valid old password" });
    }

    distributor.password = validate.new_password;
    await distributor.save();
    return response.json({ message: "Password change successfully" });
  }
}
