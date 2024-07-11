import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ErrorReporter } from "./Repoters/ErrorRepoters";

export default class DistributorValidator {
  constructor(protected ctx: HttpContextContract) {}

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
    name: schema.string({}, [rules.minLength(5), rules.maxLength(50)]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({
        table: "distributors",
        column: "email",
      }),
    ]),
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
    "name.required": "Please enter Name",
    "name.minLength": "Name must be at least 4 characters",
    "name.maxLength": "User should be able to maximum 35 characters in name",

    "email.required": "Please enter email",
    "password.required": "Please enter password",
    "confirm_password.required": "Please enter confirm password",

    email: ` Invalid {{ field }} address.`,
    "email.unique": `{{ field }} address already exist.`,
    "password.minLength": "{{ field }} can not have less than 4 characters",
    // minLength: "{{ field }} can not have less than 4 characters",
    // maxLength: "{{ field }} can not have less than 15 characters",
    regex: `{{ field }} should be minimum 4 and maximum 15 characters are allow.`,
    equalTo: `Password and confirm password should be same.`,
  };
}

export class DistLoginValidator {
  constructor(protected ctx: HttpContextContract) {}

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
    email: schema.string({}, [rules.email()]),
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

    "email.required": "Please enter email",
    "password.required": "Please enter password",
    "confirm_password.required": "Please enter confirm password",

    email: ` Invalid {{ field }} address.`,
    "email.unique": `{{ field }} address already exist.`,
    "password.minLength": "{{ field }} can not have less than 4 characters",
    // minLength: "{{ field }} can not have less than 4 characters",
    // maxLength: "{{ field }} can not have less than 15 characters",
    regex: `{{ field }} should be minimum 4 and maximum 15 characters are allow.`,
    equalTo: `Password and confirm password should be same.`,
  };
}

export class DistributorUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = ErrorReporter;

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
    name: schema.string({}, [rules.minLength(5), rules.maxLength(50)]),
    email: schema.string({}, [
      rules.email(),
      rules.unique({
        table: "distributors",
        column: "email",
      }),
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
    "name.required": "Please enter Name",
    "name.minLength": "Name must be at least 4 characters",
    "name.maxLength": "User should be able to maximum 35 characters in name",

    "email.required": "Please enter email",

    email: ` Invalid {{ field }} address.`,
    "email.unique": `{{ field }} address already exist.`,

    // minLength: "{{ field }} can not have less than 4 characters",
    // maxLength: "{{ field }} can not have less than 15 characters",
  };
}

export class ChangePasswordValidator {
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
