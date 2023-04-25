import { serverService } from "../services/serverService";
import { validate as uuidValidate } from "uuid";
import { HttpError } from "../errs/HttpError";

class ServerController {
  createServer = async (request, response, next) => {
    try {
      const serverData = { userId: request.user, name: request.body.name };

      const createdServer = await serverService.createServer(serverData);
      response.status(200).json(createdServer);
    } catch (error) {
      next(error);
    }
  };

  joinServer = async (request, response, next) => {
    try {
      const data = {
        userId: request.user,
        serverName: request.body.name,
      };
      const addedUser = await serverService.joinServer(data);
      response.status(200).json(addedUser);
    } catch (error) {
      next(error);
    }
  };

  leaveServer = async (request, response, next) => {
    try {
      const data = {
        userId: request.user,
        serverName: request.body.name,
      };
      const left = await serverService.leaveServer(data);
      response.status(200).json(left);
    } catch (error) {
      next(error);
    }
  };

  fetchOneServer = async (request, response, next) => {
    try {
      const uuid = request.params.uuid;

      if (!uuidValidate(uuid)) {
        throw new HttpError(400, "Invalid server ID");
      }
      const server = await serverService.fetchOneServer(uuid);
      response.status(200).json(server);
    } catch (error) {
      next(error);
    }
  };

  fetchAllServer = async (request, response, next) => {
    try {
      const returnData = await serverService.fetchAllServer();
      response.status(200).json(returnData);
    } catch (error) {
      next(error);
    }
  };
}

export const serverController = new ServerController();
