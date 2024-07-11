// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Skill from "App/Models/Skill";
import SkillUser from "App/Models/SkillUser";
import User from "../../Models/User";
export default class UserSkillsController {
  public async create({ request, auth, response }) {
    const skill_id = request.input("skill_id");

    const skill: any = await Skill.find(skill_id);
    console.log("skill_id>>>>>>>>>>>>>>", skill_id);

    const user: any = await User.find(auth.user.id);
    console.log("user_id>>>>>>>>>>>", user.id);

    const result = await SkillUser.create({
      skill_id: skill_id,
      user_id: auth.user.id,
    });

    console.log(auth.user.id);
    return response.json({
      status: true,
      message: "Skill User is created successfully",
      result,
    });
  }

  public async getList({ response }) {
    const skillUser = await SkillUser.all();

    if (!skillUser) {
      return response.json({
        status: false,
        message: "Skill user can`t Get lists",
      });
    }
    return response.json({
      status: true,
      message: "Skill user can Get lists successfully",
      skillUser,
    });
  }
}
