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
      RHOST: string;
      RPORT: string; 
    }

  }
  
}


const { USERNAME, PASSWORD, DATABASE, HOST, DIALECT, PORT, RHOST, RPORT } =
  process.env;

export { USERNAME, PASSWORD, DATABASE, HOST, DIALECT, PORT, RHOST, RPORT };
