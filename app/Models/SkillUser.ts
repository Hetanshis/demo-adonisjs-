import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import User from "./User";
import Skill from "./Skill";

export default class SkillUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public user_id: number;

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>;

  @column()
  public skill_id: number;

  @belongsTo(() => Skill)
  public skill: BelongsTo<typeof Skill>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
