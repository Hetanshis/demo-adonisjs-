import { DateTime } from "luxon";
import {
  BaseModel,
  column,
  ManyToMany,
  manyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import User from "./User";

export default class Skill extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @manyToMany(() => User, {
    pivotColumns: ["created_at"],
  })
  public skills: ManyToMany<typeof User>;

  @column()
  public name: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
