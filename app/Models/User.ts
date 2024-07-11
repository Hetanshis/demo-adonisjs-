import { DateTime } from "luxon";
import Hash from "@ioc:Adonis/Core/Hash";
import {
  column,
  beforeSave,
  BaseModel,
  hasMany,
  HasMany,
  manyToMany,
  ManyToMany,
} from "@ioc:Adonis/Lucid/Orm";
import Post from "./Post";
import Skill from "./Skill";

export default class User extends BaseModel {
  @manyToMany(() => Skill, {
    pivotColumns: ["created_at"],
  })
  public skills: ManyToMany<typeof Skill>;

  @column({ isPrimary: true })
  public id: number;

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public image: string;

  @column()
  public email_verify_token: string | null;

  @column()
  public is_verified: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
