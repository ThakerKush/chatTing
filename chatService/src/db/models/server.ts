import { Sequelize, DataTypes, Model, Optional, IndexHints } from "sequelize";

//Defines all required attributes for a user
interface ServerAttributes {
  id: number;
  uuid: string;
  name: string;
}

//Defines attributes that are required for creating a row
interface ServerCreationAttributes extends Optional<ServerAttributes, "id"> {}

//Defines attributes that sequelize will take care of
interface ServerInstance
  extends Model<ServerAttributes, ServerCreationAttributes>,
    ServerAttributes {
  created_at: Date;
  updated_at: Date;
}

module.exports = (sequelize: Sequelize) => {
  const Server = sequelize.define<ServerInstance>(
    "Server",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: {
        unique: false,
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "servers",
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  Server.prototype.toJSON = function () {
    const vals = Object.assign({}, this.get());

    delete vals.id;
    delete vals.created_at;
    delete vals.updated_at;

    return vals;
  };
  return Server;
};
