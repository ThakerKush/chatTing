import { Router } from "express";
import { validate } from "../middleware/validate";
import { z } from "zod";
import authenticate from "../middleware/authenticate";
import { chatController } from "../controller/chatController";

class chatRoutes {
  public path = "/";
  public router;

  constructor() {
    this.router = Router();
    this.startRoutes();
  }

  private startRoutes() {
    this.router.get(
      `${this.path}chat/:chatId/`,
      authenticate,
      chatController.showChat
    );
    this.router.get(
        `${this.path}chat/:chatId/:username?`,
        authenticate,
        chatController.showChat
      );
  }
}

export const chatRouts = new chatRoutes();
