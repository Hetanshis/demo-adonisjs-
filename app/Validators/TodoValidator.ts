import { schema, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ErrorReporter } from "./Repoters/ErrorRepoters";

export default class TodoValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = ErrorReporter;

  public schema = schema.create({
    title: schema.string({}, [rules.minLength(3), rules.maxLength(50)]),
    is_completed: schema.boolean.optional(),
  });

  public messages = {
    //required: '{{ field }} is required.',
    "title.required": "Please enter Title",
    "title.minLength": "Todo must be at least 3 characters",
    "title.maxLength": "Title should be able to maximum 50 characters.",
  };
}

export class TodoUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}
  public reporter = ErrorReporter;

  public schema = schema.create({
    title: schema.string({}, [rules.minLength(3), rules.maxLength(50)]),
    is_completed: schema.boolean.optional(),
  });

  public messages = {
    //required: '{{ field }} is required.',
    "title.required": "Please enter Title",
    "title.minLength": "Title must be at least 3 characters",
    "title.maxLength": "Title should be able to maximum 50 characters.",
  };
}
