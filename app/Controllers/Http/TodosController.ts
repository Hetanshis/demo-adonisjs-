import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import Todo from "App/Models/Todo";
import User from "App/Models/User";
import TodoValidator from "App/Validators/TodoValidator";
import { resetRetrieveHandlers } from "source-map-support";
import nodemailer from 'nodemailer'

export default class TodosController {
  public async index({ request, response }: HttpContextContract) {
    const page = request.input("page", 1);
    const limit = request.input("per_page", 5);
    const todos = await Todo.query().orderBy("id", "asc").paginate(page, limit);

    if (!todos) {
      return response.json({ status: false, message: "Todo can`t Get Lists" });
    }
    // //selected list can view:-----
    // // return todos.map((todo) =>
    // //   todo.serialize({ fields: ["id", "title", "is_completed"] })
    // // );
    await this.sendWelcomeEmail(user)
    return response.json({
      status: true,
      message: "Todo can Get Lists successfully",
      todos,
    });
  }

 


  public async store({ request, response }: HttpContextContract) {
    const data = await request.validate(TodoValidator);

    Todo.create({ title: data.title, is_completed: data.is_completed });
    return response
      .status(201)
      .json({ status: true, message: "Todo Created List successfully" });
  }

  public async update({ request, response, params }: HttpContextContract) {
    const todo = await Todo.findOrFail(params.id);

    const data = await request.validate(TodoValidator);
    const result = await Todo.query().where("id", params.id).update({
      title: data.title,
      is_completed: data.is_completed,
    });

    if (!result) {
      return response.json({
        status: false,
        message: "Todo list can`t Updated",
      });
    }
    return response
      .status(202)
      .json({ status: true, message: "Todo Update list successfully" });
  }

  public async getList({ request, response, params }: HttpContextContract) {
    const todo = await Todo.findOrFail(params.id);
    return response.json({
      status: true,
      message: "Todo fetch list successfully",
      todo,
    });
  }

  public async delete({ request, response, params }: HttpContextContract) {
    const todo = await Todo.findOrFail(params.id);
    await todo.delete();

    return response.json({
      status: true,
      message: "Todo deleted list successfully",
    });
  }
}
