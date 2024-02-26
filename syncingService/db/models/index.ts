import fs from "fs";
import path from "path";
import { Sequelize, ModelStatic, DataTypes } from "sequelize";
import Redis from "ioredis";
import { MessageInstance } from "./messages";
const basename = path.basename(__filename);

import {
  USERNAME,
  PASSWORD,
  DATABASE,
  HOST,
  DIALECT,
  PORT,
  RHOST,
  RPORT,
} from "../../config/index";

export const RDB = new Redis({
  host: RHOST,
  port: Number(RPORT),
});

interface DB {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
  messages: ModelStatic<MessageInstance>;
  server: any;
  user: any;
}
//@ts-expect-error
const DB: DB = {};

const sequelize = new Sequelize(DATABASE, USERNAME, PASSWORD, {
  host: HOST,
  dialect: DIALECT,
  port: Number(PORT),
  logging: false,
});

DB.sequelize = sequelize; //connection instance

DB.Sequelize = Sequelize; // library

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      DB.sequelize,

      DataTypes
    );
    //@ts-expect-error
    DB[model.name] = model;
  });

Object.keys(DB).forEach((modelName) => {
  //@ts-expect-error
  if (DB[modelName].associate) {
    //@ts-expect-error
    DB[modelName].associate(DB);
  }
});

DB.messages = require("./messages")(DB.sequelize, DataTypes);

export { DB };
