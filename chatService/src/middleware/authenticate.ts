import jwt from "jsonwebtoken";
import { DB } from "../db/models/index";
import { SECRET } from "../config/index";

const authenticate = async (request, response, next) => {
  const token = request.cookies["Authorization"];
  try {
    const decodedData: any = await jwt.verify(token, SECRET);
    const user = await DB.user.findByPk(decodedData.id);
    if (!user) {
      response.status(400).status("user not found");
    } else {
      const AuthUser = user["id"];
      request.user = AuthUser;
      next();
    }
  } catch (error) {
    if (error["message"] === "jwt expired") {
      response.status(400).send("JWT_EXPIRED");
    } else {
      response.status(400).send("INVALID_JWT");
    }
  }
};

export default authenticate;
