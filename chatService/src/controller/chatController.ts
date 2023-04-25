import { chatServices } from "../services/chatServices";
import { z } from "zod";

class ChatController {
  showChat = async (request, response, next) => {
    try {
      const schema = z.object({
        chatId: z.string().uuid(),
        page: z.string().refine((value) => !isNaN(Number(value)), {
          message: "page should be a number",
        }),
        limit: z.string().refine((value) => !isNaN(Number(value)), {
          message: "limit should be a number",
        }),
      });

      await schema.parseAsync({
        chatId: request.params.chatId,
        page: request.query.page,
        limit: request.query.limit,
      });

      const messages = await chatServices.listMessages({
        uuid: request.params.chatId,
        page: request.query.page,
        limit: request.query.limit,
        username: request.query.username,
      });
      response.status(200).json(messages);
    } catch (error) {
      next(error);
    }
  };
}
export const chatController = new ChatController();
