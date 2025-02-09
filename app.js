import express from "express";
import cors from "cors";
import routes from "#routes";
import sequelize from "#sequelize/sequelize.js";
import init from "./bootstrap.js";

const port = process.env.PORT ?? 3000;
const app = express();
init();

app
  .use(cors())
  .use(express.json({ limit: 52428800 }))
  .use(express.urlencoded({ extended: false, limit: 52428800 }))
  .use(routes())
  .use((_, res) => {
    res.status(404).send("not found");
  });

app.listen(port, () => {
  console.log(`Сервер запущен на ${port} порте`);
});

process.on("uncaughtException", async (err) => {
  await sequelize.close();

  console.log(`Uncaught exception:${err.message}`);
  console.log(err.stack);
  process.exit(1);
});
