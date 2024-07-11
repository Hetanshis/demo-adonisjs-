import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ErrorReporter } from "./Repoters/ErrorRepoters";

export default class ResetPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = ErrorReporter;

  public cacheKey = "User_Create_Password_Request_Validator";
  public refs = schema.refs({
    password: this.ctx.request.input("password").toString(),
  });

  public schema = schema.create({
    password: schema.string({ trim: true, escape: true }, [
      rules.regex(/^(?!.* ).{4,15}$/),
      // rules.regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
    ]),
    confirm_password: schema.string({}, [rules.equalTo(this.refs.password)]),
  });

  public messages = {
    required: "{{ field }} is required.",
    regex: `{{ field }} should be minimum 4 and maximum 15 characters are allow.`,
    equalTo: `Password and confirm password should be same.`,
  };
}
