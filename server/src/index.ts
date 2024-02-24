import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });

import env from "./config/env.config";
import db from "./db/models";
import router from "./routes";

const app: Express = express();
app.use(express.json());
app.use(router);

db.sequelize.sync();

app.get("/", (req: Request, res: Response) => {
  return res.json({
    msg: "Hello World",
  });
});

const PORT = env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
