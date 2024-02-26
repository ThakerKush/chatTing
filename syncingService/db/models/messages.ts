import { Sequelize, DataTypes, Model, Optional, IndexHints } from "sequelize";
import { DB } from "./index";

//Defines all required attributes for a user
interface MessageAttributes {
  id: number;
  user_id: number;
  server_id: number;
  value: string;
}

//Defines attributes that are required for creating a row
interface MessageCreationAttributes extends Optional<MessageAttributes, "id"> {}

//Defines attributes that sequelize will take care of
export interface MessageInstance
  extends Model<MessageAttributes, MessageCreationAttributes>,
    MessageAttributes {
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: Sequelize) => {
  const Messages = sequelize.define<MessageInstance>(
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
        allowNull: false,
        references: {
          model: DB.user,
          key: "id",
        },
      },
      value: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      server_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: DB.server,
          key: "id",
        },
      },
    },
    {
      tableName: "messages",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Messages.prototype.toJSON = function () {
    const vals = Object.assign({}, this.get());

    delete vals.id;
    delete vals.created_at;
    delete vals.updated_at;

    return vals;
  };
  return Messages;
};
