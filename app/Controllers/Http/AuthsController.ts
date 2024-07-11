import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import UserValidator, {
  UserLogInValidator,
} from "App/Validators/UserValidator";
import Env from "@ioc:Adonis/Core/Env";
import Hash from "@ioc:Adonis/Core/Hash";
import Mail from "@ioc:Adonis/Addons/Mail";
import UserUpdateValidator from "App/Validators/UserUpdateValidator";

import ChangePasswordValidator from "App/Validators/ChangePasswordValidator";

import ResetPasswordValidator from "App/Validators/ResetPasswordValidator";
import Application from "@ioc:Adonis/Core/Application";

export default class AuthsController {
  //User Register:--

  public async register({ request, response, auth }: HttpContextContract) {
    const data: any = await request.validate(UserValidator);

    const userEmail = await User.findBy("email", data.email);
    if (userEmail) {
      return response.status(200).json({
        status: false,
        message: `Email address is already exist.`,
      });
    }

    const user: any = await User.create({
      email: data.email,
      password: data.password,
      name: data.name,
      image: data.image,
    });

    await user.image.move(Application.tmpPath("uploadsssss"));
    user.image = user.image.fileName;
    await user.save();
    const token = await auth
      .use("api")
      .attempt(data.email, data.password, { expiresIn: "1h" });
    user.email_verify_token = token.token;

    await Mail.use("smtp").send(
      (message) => {
        message
          .to("hetanshishah876@gmail.com")
          .from(Env.get("SMTP_USERNAME"))
          .subject("Welcome Onboard!")
          .html(
            "<p>Please click on the following link to verify your email address:</p>" +
              '<a href="http://127.0.0.1:3333/api/user/verify-email' +
              token.token +
              '">http://127.0.0.1:3333/api/user/verify-email' +
              token.token +
              "</a>"
          );
      },
      {
        transaction: true,
        openTracking: false,
      }
    );

    await user.save();

    if (!user) {
      return response.json({ status: false, message: "User does not exist" });
    }

    return response.json({
      status: true,
      message: "User registered successfully",
      token,
    });
  }

  //Login:----

  public async login({ request, response, auth, view }: HttpContextContract) {
    const data: any = await request.validate(UserLogInValidator);
    const user = await User.findBy("email", data.email); //OR    // query()
    //   .where("email", data.email)
    //   .firstOrFail();
    if (!user) {
      return response.json({
        status: false,
        message: "Invalid email address..",
      });
    }
    if (!user.password) {
      return view.render("Password", {
        title: `your password? Enter your password and we'll send you an email.`,
        error: `You're not part of system.`,
      });
    }
    // Verify password
    if (!(await Hash.verify(user.password, request.input("password")))) {
      return response.unauthorized({
        status: false,
        message: "Please Enter valid password",
      });
    }

    if (!user.is_verified) {
      return response.json({
        status: false,
        message: "Verify your email account..",
      });
    }

    const token = await auth
      .use("api")
      .attempt(data.email, data.password, { expiresIn: "1h" });

    return response.json({
      status: true,
      message: "User login successfully",
      token,
    });
  }

  public async forgotPassword({
    request,
    response,
    params,
  }: HttpContextContract) {
    const email = request.only(["email"]);

    // const token = await auth.generate(await User.findBy("email", params.email));

    const user: any = await User.find("email", params.email);

    await Mail.use("smtp").send(
      (message) => {
        message
          .to("hetanshi@yopmail.com")
          .from(Env.get("SMTP_USERNAME"))
          .subject("Welcome Onboard!")
          .html(
            "<p>Please click on the following link to verify your email address:</p>" +
              '<a href="http://127.0.0.1:3333/api/user/forgot-password/' +
              params.email +
              '">http://127.0.0.1:3333/api/user/forgot-password/' +
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

  public async changePassword({
    request,
    auth,
    response,
  }: HttpContextContract) {
    const user = await auth.use("api").authenticate();
    const requestData = await request.validate(ChangePasswordValidator);
    const isValidPassword = await Hash.verify(
      user.password,
      requestData.old_password
    );
    if (!isValidPassword) {
      return response.status(400).json({
        status: false,
        message: `Please enter valid old password.`,
      });
    }
    user.password = requestData.new_password;
    await user.save();
    response.status(200).json({
      status: true,
      message: `Password changed successfully.`,
    });
  }

  public async resetPassword({ request, response, params }) {
    const email = params.email;

    const user = await User.findBy("email", email);

    if (!user) {
      return response.json({
        message: "Enter valid email",
      });
    }

    const { password } = await request.validate(ResetPasswordValidator);
    user.password = password;

    await user.save();
    return response.json({ message: "Password reset successfully" });
  }
  // ---------------------------------------Profile----------------------------------------------

  //Get user:------

  public async getUser({ response, auth }) {
    const user = await auth.use("api").authenticate();

    await User.query().preload("posts");
    if (!user) {
      return response.json({ status: false, message: "User does not exist" });
    }
    return response.json({ status: true, message: "User get profile", user });
  }

  //Update User:----

  public async update({ request, response, auth }) {
    const user: any = await User.find(auth.user.id);

    if (!user) {
      return response.json({
        status: false,
        message: "User does not exist",
      });
    }

    const data = await request.validate(UserUpdateValidator);

    // user.email = request.input("email");
    // user.name = request.input("name");

    const result = await User.query().update({
      email: data.email,
      name: data.name,
      password: data.password,
    });

    if (!result) {
      return response.json({
        status: false,
        message: "User can`t update profile",
      });
    }

    return response.json({
      status: true,
      message: "User update profile successfully",
    });
  }

  public async delete({ response, auth }) {
    const user = await User.findOrFail(auth.user.id);
    if (!user) {
      return response.json({
        status: false,
        message: "User does not exist",
      });
    }
    await user.delete();

    return response.json({
      status: true,
      message: "User deleted profile successfully",
    });
  }
}
