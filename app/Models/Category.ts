import { DateTime } from "luxon";
import { BaseModel, BelongsTo, belongsTo, column } from "@ioc:Adonis/Lucid/Orm";
import Product from "./Product";

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public title: string;

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>;

  @column()
  public productId: number;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
