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
      RPORT: string;
      RHOST: string;
      SECRET: string;
    }
  }
}

const {
  USERNAME,
  PASSWORD,
  DATABASE,
  HOST,
  DIALECT,
  PORT,
  RHOST,
  RPORT,
  SECRET,
} = process.env;

export {
  USERNAME,
  PASSWORD,
  DATABASE,
  HOST,
  DIALECT,
  PORT,
  RHOST,
  RPORT,
  SECRET,
};
