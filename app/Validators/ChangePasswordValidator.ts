import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ErrorReporter } from "./Repoters/ErrorRepoters";

export default class ChangePasswordValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public reporter = ErrorReporter;

  public cacheKey = "User_Change_Password_Request_Validator";
  public refs = schema.refs({
    new_password: this.ctx.request.input("new_password").toString(),
  });

  public schema = schema.create({
    old_password: schema.string({ trim: true, escape: true }, [
      rules.regex(/^(?!.* ).{4,15}$/),
    ]),
    new_password: schema.string({ trim: true, escape: true }, [
      // rules.regex(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
      rules.regex(/^(?!.* ).{4,15}$/),
    ]),
    confirm_password: schema.string({}, [
      rules.regex(/^(?!.* ).{4,15}$/),
      rules.equalTo(this.refs.new_password),
    ]),
  });

  public messages = {
    required: "{{ field }} is required.",
    "current_password.regex":
      "{{ field }} should be minimum 4 and maximum 15 characters are allow.",

    regex: `{{ field }} should be minimum 4 and maximum 15 characters are allow.`,
    equalTo: `Password and confirm password should be same.`,
  };
}
