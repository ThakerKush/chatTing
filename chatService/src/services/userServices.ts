import { DB } from "../db/models/index";
import bcrypt from "bcrypt";
import { HttpError } from "../errs/HttpError";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { SECRET } from "../config/index";

class UserSerivce {
  User = DB.user;
  saultRouds = 10;
  signUp = async (userData) => {
    try {
      const findEmail = await this.User.findOne({
        where: { email: userData.email },
      });
      const findUsername = await this.User.findOne({
        where: { username: userData.username },
      });
      if (findEmail || findUsername) {
        throw new HttpError(409, `The user already exists`);
      }

      const hashedPassword = await bcrypt.hash(
        userData.password,
        this.saultRouds
      );

      const createdUser = await this.User.create({
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      });

      return createdUser;
    } catch (error) {
      console.error("[User Service] Error while signing up user", error);
      throw error;
    }
  };

  login = async (userData) => {
    try {
      const usernameOrEmail = userData.usernameOrEmail;
      if (!usernameOrEmail) {
        throw new HttpError(409, `UserName or Email not provided.`);
      }
      const user = await this.User.findOne({
        where: {
          [Op.or]: [
            { username: userData.usernameOrEmail },
            { email: userData.usernameOrEmail },
          ],
        },
      });
      if (!user) {
        throw new HttpError(409, "Not a valid user");
      }
      const DBpassword = user.password;
      const hashedPassword = await bcrypt.compare(
        userData.password,
        DBpassword
      );

      if (hashedPassword) {
        const token = await jwt.sign(
          { id: user.id, username: user.username },
          SECRET,
          { expiresIn: 60 * 5 }
        );
        const loginData = {
          Bearer: token,
        };

        return loginData;
      } else {
        throw new HttpError(409, "Wrong Password!");
      }
    } catch (error) {
      console.error("[User Service] Error while loging in user", error);
      throw error;
    }
  };
}

export { UserSerivce };
