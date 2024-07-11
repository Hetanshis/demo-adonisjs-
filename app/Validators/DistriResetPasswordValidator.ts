import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ErrorReporter } from "./Repoters/ErrorRepoters";

export default class DistriResetPasswordValidator {
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
  public refs = schema.refs({
    cpassword: this.ctx.request.input("password"),
  });
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
  public schema = schema.create({
    password: schema.string.optional({ trim: true, escape: true }, [
      rules.regex(/^(?!.* ).{4,15}$/),
    ]),
    confirm_password: schema.string.optional({ trim: true, escape: true }, [
      rules.equalTo(this.refs.cpassword),
    ]),
  });

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {
    //required: '{{ field }} is required.',

    "password.required": "Please enter password",
    "confirm_password.required": "Please enter confirm password",

    "password.minLength": "{{ field }} can not have less than 4 characters",
    // minLength: "{{ field }} can not have less than 4 characters",
    // maxLength: "{{ field }} can not have less than 15 characters",
    regex: `{{ field }} should be minimum 4 and maximum 15 characters are allow.`,
    equalTo: `Password and confirm password should be same.`,
  };
}
