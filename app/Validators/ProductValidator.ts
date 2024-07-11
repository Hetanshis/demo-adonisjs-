import { schema, CustomMessages, rules } from "@ioc:Adonis/Core/Validator";
import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { ErrorReporter } from "./Repoters/ErrorRepoters";

export default class ProductValidator {
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
    title: schema.string({}, [rules.minLength(5), rules.maxLength(30)]),
    description: schema.string({}, [rules.minLength(5), rules.maxLength(50)]),
    price: schema.string({}, [rules.minLength(1)]),
    quantity: schema.string({}, [rules.minLength(1)]),
    image: schema.file({
      size: "2mb",
      extnames: ["jpg", "png", "gif"],
    }),
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
    required: "{{ field }} is required.",
    "title.minLength": `Title must contain at least five characters.`,
    "title.maxLength": "Title should be able to maximum 30 characters.",
    "description.minLength": "Body must contain at least five characters.",
    "description.maxLength": "Body should be able to maximum 50 characters.",
    "price.minLength": "Price must contain at least one Number",
    "quantity.minLength": "Quantity must contain at least one Number",
  };
}

export class ProductUpdateValidator {
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
    title: schema.string({}, [rules.minLength(5), rules.maxLength(30)]),
    description: schema.string({}, [rules.minLength(5), rules.maxLength(50)]),
    price: schema.string({}, [rules.minLength(1)]),
    quantity: schema.string({}, [rules.minLength(1)]),
    image: schema.file({
      size: "2mb",
      extnames: ["jpg", "png", "gif"],
    }),
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
    required: "{{ field }} is required.",
    "title.minLength": `Title must contain at least five characters.`,
    "title.maxLength": "Title should be able to maximum 30 characters.",
    "description.minLength": "Body must contain at least five characters.",
    "description.maxLength": "Body should be able to maximum 50 characters.",
    "price.minLength": "Price must contain at least one Number",
    "quantity.minLength": "Quantity must contain at least one Number",
  };
}
