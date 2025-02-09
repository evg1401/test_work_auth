import { Sequelize } from "sequelize";

class Db {
  static instance = null;

  constructor() {
    if (!Db.instance) {
      Db.instance = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWD,
        {
          host: process.env.DB_HOST,
          dialect: process.env.DB_DIALECT,
        }
      );
    }
  }

  getInstance() {
    return Db.instance;
  }
}

export default new Db().getInstance();
