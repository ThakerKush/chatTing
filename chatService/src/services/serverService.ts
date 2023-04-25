import { HttpError } from "../errs/HttpError";
import { DB } from "../db/models/index";
import { v4 as uuidv4 } from "uuid";

class ServerService {
  Server = DB.server;
  User = DB.user;

  fetchAllServer = async () => {
    const servers = await this.Server.findAll();
    return servers;
  };

  fetchOneServer = async (uuid: string) => {
    try {
      const server = await this.Server.findOne({ where: { uuid: uuid } });
      const returnObject: any = {};
      returnObject.server = server;
      returnObject.users = await server.getUsers({
        joinTableAttributes: [],
        attributes: {
          exclude: ["email"],
        },
      });
      if (!server) {
        throw new HttpError(409, "The server does not exist.");
      }
      return returnObject;
    } catch (error) {
      console.error("[Server Service] Error while fetching a server", error);
      throw error;
    }
  };

  createServer = async (serverData: { name: string; userId: number }) => {
    try {
      const findServer = await this.Server.findOne({
        where: { name: serverData.name },
      });
      if (findServer) {
        throw new HttpError(409, "The server already exists");
      }
      const serverId = uuidv4();
      const createdServer = await this.Server.create({
        uuid: serverId,
        name: serverData.name,
      });
      const user = await this.User.findByPk(serverData.userId);

      await createdServer.addUser(user);
      const { id, created_at, updated_at, ...createdUserAttributs } =
        createdServer.toJSON();
      return createdUserAttributs;

      //
    } catch (error) {
      console.error("[Server Service] Error while creating a server", error);
      throw error;
    }
  };

  joinServer = async (data: { userId: number; serverName: string }) => {
    try {
      const user = await this.User.findByPk(data.userId);
      const server = await this.Server.findOne({
        where: { name: data.serverName },
      });
      if (!server) {
        throw new HttpError(409, "Server does not exist.");
      }
      const exists = await server.hasUser(user);
      if (exists) {
        throw new HttpError(409, "Useralready part of the server.");
      }

      const addedUser = await server.addUser(user);
      return addedUser;
    } catch (error) {
      console.error("[Server Service] Error while joining a server", error);
      throw error;
    }
  };

  leaveServer = async (data: { userId: number; serverName: string }) => {
    try {
      const user = await this.User.findByPk(data.userId);
      const server = await this.Server.findOne({
        where: { name: data.serverName },
      });
      const exists = await server.hasUser(user);
      if (server && exists) {
        const removed = await server.removeUser(user);
        return removed;
      }
      throw new HttpError(
        409,
        "User is not part of server or Server does not exist."
      );
    } catch (error) {
      console.error("[Server Service] Error while leaving a server", error);
      throw error;
    }
  };

  checkUser = async (data: { userId: number; uuid: string }) => {
    try {
      const user = await this.User.findByPk(data.userId);
      const server = await this.Server.findOne({ where: { uuid: data.uuid } });

      if (user && server) {
        const exists = await server.hasUser(user);
        return exists;
      } else {
        throw new HttpError(409, "User or Server does not exist");
      }
    } catch (error) {
      console.error("[Server Service] Error while checking user", error);
    }
  };
  getServerId = async (uuid: string) => {
    try {
      const serverId = await this.Server.findOne({ where: { uuid: uuid } });
      if (serverId) {
        return serverId.id;
      } else {
        throw new HttpError(409, "Server does not exist");
      }
    } catch (error) {
      console.error("[Server Service] Error while getting server id", error);
    }
  };
}

export const serverService = new ServerService();
