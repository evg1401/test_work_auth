import { scryptSync } from "crypto";
import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

function set(value) {
  const password = scryptSync(value, process.env.JWT_TOKEN_SALT, 64).toString(
    "hex"
  );

  this.setDataValue("password", password);
}

const tableName = "users";
const User = {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    set,
  },
};

export default sequelize.define("User", User, { tableName });
