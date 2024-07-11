import { DateTime } from "luxon";
import { BaseModel, beforeSave, column } from "@ioc:Adonis/Lucid/Orm";
import Hash from "@ioc:Adonis/Core/Hash";

export default class Distributor extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;

  @column()
  public email: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public email_verify_token: string;

  @column()
  public is_verified: boolean;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async hashPassword(distributor: Distributor) {
    if (distributor.$dirty.password) {
      distributor.password = await Hash.make(distributor.password);
    }
  }
}
