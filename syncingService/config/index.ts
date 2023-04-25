import * as dotenv from "dotenv";
import path from "path";
import { Dialect } from "sequelize";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      USERNAME: string;
      PASSWORD: string;
      DATABASE: string;
      HOST: string;
      DIALECT: Dialect;
      PORT: string;
    }
  }
}

dotenv.config({
  path: path.resolve("../.env"),
});

const { USERNAME, PASSWORD, DATABASE, HOST, DIALECT, PORT } = process.env;

export { USERNAME, PASSWORD, DATABASE, HOST, DIALECT, PORT };
