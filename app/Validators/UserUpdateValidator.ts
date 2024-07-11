import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ErrorReporter } from "./Repoters/ErrorRepoters";

export default class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public reporter = ErrorReporter;

  public schema = schema.create({
    email: schema.string({}, [
      rules.email(),
      rules.unique({
        table: "users",
        column: "email",
      }),
    ]),

    name: schema.string({ trim: true, escape: true }, [
      rules.minLength(4),
      rules.maxLength(35),
    ]),
  });

  public messages = {
    //required: '{{ field }} is required.',
    "name.required": "Please enter Name",
    "name.minLength": "Name must be at least 4 characters",
    "name.maxLength": "User should be able to maximum 35 characters in name",

    "email.required": "Please enter email",

    email: ` Invalid {{ field }} address.`,
    "email.unique": `{{ field }} address already exist.`,
  };
}
