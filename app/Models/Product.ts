import { DateTime } from "luxon";
import { BaseModel, column, HasMany, hasMany } from "@ioc:Adonis/Lucid/Orm";
import Category from "./Category";

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @hasMany(() => Category)
  public categories: HasMany<typeof Category>;

  @column()
  public title: string;

  @column()
  public description: string;

  @column()
  public price: string;

  @column()
  public image: string;

  @column()
  public quantity: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
