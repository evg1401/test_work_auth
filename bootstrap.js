import sequelize from "#sequelize/sequelize.js";

export default async () => {
  if (process.env.NODE_ENV === "dev") await sequelize.sync();
};
