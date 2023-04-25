import { Sequelize, DataTypes, Model, Optional, IndexHints } from "sequelize";
import {DB} from "./index"
module.exports = (sequelize: Sequelize) => {
  const Messages = sequelize.define(
    "Messages",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull:false,
        references: {
          model: DB.user,
          key: "id",
        },
      },
      value: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
    server_id:{
       type: DataTypes.INTEGER,
       allowNull:false,
       references:{
        model:DB.server,
        key:"id"
       }
    },
    },
    {
      tableName: "messages",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Messages;
};
