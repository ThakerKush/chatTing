import { Sequelize, DataTypes, Model, Optional, IndexHints } from "sequelize";
import { DB } from "./index";
module.exports = (sequelize: Sequelize) => {
  const serverUsers = sequelize.define(
    "serverUsers",
    {
      user_id: {
        type: DataTypes.BIGINT,
        references: {
          model: DB.user,
          key: "id",
        },
      },
      server_id: {
        type: DataTypes.BIGINT,
        references: {
          model: DB.server,
          key: "id",
        },
      },
    },
    {
      tableName: "server_users",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return serverUsers;
};
