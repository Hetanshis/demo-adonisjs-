// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Skill from "App/Models/Skill";
import SkillValidator from "App/Validators/SkillValidator";

export default class SkillsController {
  public async create({ request, response }) {
    const data = await request.validate(SkillValidator);
    const skill = await Skill.create(data);
    await skill.save();

    return response.json({ message: "Skill created successfully" });
  }

  public async getLists({ request, response }) {
    const page = request.input("page", 1);
    const limit = request.input("per_page", 2);
    const skill = await Skill.query()
      .orderBy("id", "asc")
      .paginate(page, limit);
    return response.json({
      message: "Skill get fetch lists successfully",
      skill,
    });
  }
}
