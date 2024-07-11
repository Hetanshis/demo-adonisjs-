import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class extends BaseSchema {
  protected tableName = "distributors";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.string("name", 150).notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("email_verify_token");
      table.boolean("is_verified");
      table.string("reset_password_token");
      table.timestamp("created_at", { useTz: true });
      table.timestamp("updated_at", { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
