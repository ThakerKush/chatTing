import express from "express";
import { PORT } from "./config/index";
import cookieParser from "cookie-parser";
import { DB } from "./db/models/index";
import { AuthRoutes } from "./router/auth";
import { serverRouts } from "./router/server";
import { chatRouts } from "./router/chat";
import errorMiddleware from "./middleware/error";
const authRoutes = new AuthRoutes();

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public server: any;

  constructor(routes: any) {
    this.app = express();
    this.env = "DEVELOPMENT";
    this.port = 3000;
    this.connectToDB();
    this.startMiddleware();
    this.startRoutes(routes);

    this.registerErrorMiddleware();
  }

  private startMiddleware() {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  private async connectToDB() {
    try {
      await DB.sequelize.authenticate();
      console.log("Connection established");

      // await DB.sequelize.sync({ alter: true });
      console.log("database start");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  private startRoutes(routes: any) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });
  }

  public listen() {
    this.server = this.app.listen(this.port, "0.0.0.0", () => {
      console.log(`Server is listning on ${this.port}`);
    });
  }

  public getServer() {
    return this.server;
  }

  public registerErrorMiddleware() {
    this.app.use(errorMiddleware);
  }
}

const app = new App([authRoutes, serverRouts, chatRouts]);

export { app };
