import { Router } from "express";
import authenticate from "../middleware/authenticate";
import { serverController } from "../controller/serverController";

class ServerRouts {
  public path = "/";
  public router;

  constructor() {
    this.router = Router();
    this.startRoutes();
  }

  private startRoutes() {
    this.router.post(
      `${this.path}create-server`,
      authenticate,
      serverController.createServer
    );
    this.router.post(
      `${this.path}join-server`,
      authenticate,
      serverController.joinServer
    );
    this.router.post(
      `${this.path}leave-server`,
      authenticate,
      serverController.leaveServer
    );
    this.router.get(
      `${this.path}servers/`,
      authenticate,
      serverController.fetchAllServer
    );
    this.router.get(
      `${this.path}servers/:uuid?`,
      authenticate,
      serverController.fetchOneServer
    );

  }
}

export const serverRouts = new ServerRouts();
