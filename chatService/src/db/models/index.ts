// @ts-nocheck
import fs from "fs";
import path from "path";
import { Sequelize, ModelStatic } from "sequelize";
import Redis from "ioredis";
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
  user: ModelStatic<UserInstance>;
  server: ModelStatic<ServerInstance>;
  serverUser: typeof import("./serverUser");
  messages: ModelStatic<MessageInstance>;
}

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
      DB.Sequelize.DataTypes
    );
    DB[model.name] = model;
  });

Object.keys(DB).forEach((modelName) => {
  if (DB[modelName].associate) {
    DB[modelName].associate(DB);
  }
});

//define models
DB.user = require("./user")(DB.sequelize, DB.Sequelize.DataTypes);
DB.server = require("./server")(DB.sequelize, DB.Sequelize.DataTypes);
DB.serverUser = require("./serverUser")(DB.sequelize, DB.Sequelize.DataTypes);
DB.messages = require("./messages")(DB.sequelize, DB.Sequelize.DataTypes);

// DB.messages.create({value:"testtestsetsetsetsetsetsertsetsertsetsetsetset"}).then(console.log("after making"))

// DB.user.belongsToMany(DB.server, { through: DB.serverUser });
// DB.server.belongsToMany(DB.user, { through: DB.serverUser });

DB.user.belongsToMany(DB.server, {
  through: DB.serverUser,
  foreignKey: "user_id",
  otherKey: "server_id",
});
DB.server.belongsToMany(DB.user, {
  through: DB.serverUser,
  foreignKey: "server_id",
  otherKey: "user_id",
});
DB.messages.hasOne(DB.user, { foreignKey: "id" });
DB.messages.hasOne(DB.server, { foreignKey: "id" });

export { DB };
