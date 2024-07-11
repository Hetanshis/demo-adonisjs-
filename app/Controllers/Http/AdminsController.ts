import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Admin from "App/Models/Admin";
import AdminValidator, {
  AdminChangePasswordValidator,
  AdminLoginValidator,
  AdminResetPasswordValidator,
  UpdateValidator,
} from "App/Validators/AdminValidator";
import Env from "@ioc:Adonis/Core/Env";
import Hash from "@ioc:Adonis/Core/Hash";
import Mail from "@ioc:Adonis/Addons/Mail";

export default class AdminsController {
  public async register({ request, response, auth }: HttpContextContract) {
    const data: any = await request.validate(AdminValidator);

    const admin: any = await Admin.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    const token = await auth.use("web").attempt(data.email, data.password);
    admin.email_verify_token = token.token;
    await Mail.use("smtp").send(
      (message) => {
        message
          .to("hetanshishah876@gmail.com")
          .from(Env.get("SMTP_USERNAME"))
          .subject("Welcome Onboard!")
          .html(
            "<p>Please click on the following link to verify your email address:</p>" +
              '<a href="http://127.0.0.1:3333/api/admin/auth/verify-email' +
              token.token +
              '">http://127.0.0.1:3333/api/admin/auth/verify-email' +
              token.token +
              "</a>"
          );
      },
      {
        transaction: true,
        openTracking: false,
      }
    );

    await admin.save();
    if (!admin) {
      return response.json({
        status: false,
        message: "Admin does not registered",
      });
    }

    return response.json({
      status: true,
      message: "Admin registered successfully",
      token,
    });
  }

  public async login({ request, response, auth, view }: HttpContextContract) {
    const data: any = await request.validate(AdminLoginValidator);
    const admin = await Admin.findBy("email", data.email); //OR    // query()
    //   .where("email", data.email)
    //   .firstOrFail();
    if (!admin) {
      return response.json({
        status: false,
        message: "Invalid email address..",
      });
    }
    if (!admin.password) {
      return view.render("Password", {
        title: `your password? Enter your password and we'll send you an email.`,
        error: `You're not part of system.`,
      });
    }
    // Verify password
    if (!(await Hash.verify(admin.password, request.input("password")))) {
      return response.unauthorized({
        status: false,
        message: "Please Enter valid password",
      });
    }

    if (!admin.is_verified) {
      return response.json({
        status: false,
        message: "Verify your email account..",
      });
    }

    const token = await auth
      .use("web")
      .attempt(data.email, data.password, { expiresIn: "1h" });

    return response.json({
      status: true,
      message: "User login successfully",
      token,
    });
  }

  public async emailVerify({ response, params }: HttpContextContract) {
    const admin = await Admin.findBy("email_verify_token", params.token);

    if (!admin) {
      return response.json({ status: false, message: "Invalid token" });
    } else if (admin.is_verified) {
      return response.json({
        status: false,
        message: "Account has been already verified..please Login!",
      });
    } else {
      admin.is_verified = true;
      await admin.save();
      return response.json({
        status: true,
        message: "Your account has been successfully verified",
      });
    }
  }
  public async forgotPassword({ request, response, params }) {
    const email = request.only(["email"]);

    // const token = await auth.generate(await User.findBy("email", params.email));

    const admin: any = await Admin.find("email", params.email);

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
  public async ResetPassword({ request, response, params }) {
    const email = params.email;

    const admin = await Admin.findBy("email", email);

    if (!admin) {
      return response.json({ status: false, message: "Enter valid email" });
    }

    const { password } = await request.validate(AdminResetPasswordValidator);
    admin.password = password;
    await admin.save();
    return response.json({
      status: true,
      message: "Admin Password Reset successfully",
    });
  }
  // ------------------------Profile-----------------------------------
  public async getAdminProfile({ response, auth }) {
    const admin = await auth.use("web").authenticate();

    return response.json({ status: true, message: "admin get profile", admin });
  }

  public async update({ response, auth, request }: HttpContextContract) {
    // await auth.use("web").authenticate();
    const adminAuth = await Admin.find(auth.authenticate());

    const data: any = await request.validate(UpdateValidator);

    const admin = await Admin.query().update({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (!admin) {
      return response.json({
        status: false,
        message: "Admin can`t Update profile",
      });
    }

    return response.json({
      status: true,
      message: "Admin update profile successfully",
    });
  }

  public async delete({ response, auth }: HttpContextContract) {
    await Admin.find(auth.authenticate());

    await Admin.query().delete();
    return response.json({ message: "Admin Deleted profile successfully" });
  }

  public async changePassword({ request, response, auth }) {
    const admin = await auth.use("web").authenticate();

    const validate = await request.validate(AdminChangePasswordValidator);
    const VerifyPassword = await Hash.verify(
      admin.password,
      validate.old_password
    );
    if (!VerifyPassword) {
      return response.json({
        status: false,
        message: "Please enter valid old password.",
      });
    }
    admin.password = validate.new_password;
    await admin.save();
    return response.json({
      status: true,
      message: "Admin change password successfully",
    });
  }
}
