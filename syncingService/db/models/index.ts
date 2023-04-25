import fs from "fs";
import path from "path";
import { Sequelize } from "sequelize";
import Redis from "ioredis";
const basename = path.basename(__filename);

export const RDB = new Redis({
  host: "localhost",
  port: 6379,
});

import {
  USERNAME,
  PASSWORD,
  DATABASE,
  HOST,
  DIALECT,
  PORT,
} from "../../config/index";

const DB: any = {};

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
      DB.Sequelize.DataTypes
    );
    DB[model.name] = model;
  });

Object.keys(DB).forEach((modelName) => {
  if (DB[modelName].associate) {
    DB[modelName].associate(DB);
  }
});

DB.messages = require("./messages")(DB.sequelize, DB.Sequelize.DataTypes);

export { DB };
