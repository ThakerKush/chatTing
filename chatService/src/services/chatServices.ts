import { DB } from "../db/models/index";
import { HttpError } from "../errs/HttpError";

class chatService {
  Server = DB.server;
  User = DB.user;
  Messages = DB.messages;

  listMessages = async (data: {
    uuid: string;
    page: number;
    limit: number;
    username: string;
  }) => {
    try {
      const server = await this.Server.findOne({ where: { uuid: data.uuid } });

      if (!server) {
        throw new HttpError(409, "The server does not exist");
      }
      const limit = data.limit;
      const offset = limit * (data.page - 1);

      const allMessagesCount = await this.Messages.count();

      const totalPages = Math.ceil(allMessagesCount / limit);

      const messages = await this.Messages.findAll({
        offset: offset,
        limit: limit,
      });

      return { result: messages, count: allMessagesCount, pages: totalPages };
    } catch (error) {
      console.error("[Chat Service] Erro while listing messages");
      throw error;
    }
  };
}

export const chatServices = new chatService();
