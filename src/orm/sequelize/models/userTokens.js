import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const tableName = "user_tokens";
const UserTokens = {
  id: {
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  platformUid: {
    type: DataTypes.STRING,
  },
  tokenId: {
    type: DataTypes.STRING,
  },
};

export default sequelize.define("UserTokens", UserTokens, { tableName });
