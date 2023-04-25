import { UserSerivce } from "../services/userServices";

class UserController {
  userService = new UserSerivce();

  createUser = async (request, response, next) => {
    try {
      const userData = request.body;

      const createdUser = await this.userService.signUp(userData);
      response.status(200).json(createdUser);
    } catch (error) {
      console.log(error)
      response.status(400).send(error.message);
    }
  };
  loginUser = async (request, response, next) => {
    try {
      const userData = request.body;

      const loginData = await this.userService.login(userData);
      response.cookie("Authorization",loginData.Bearer)
      response.status(200).json(loginData);
    } catch (error) {
      
      response.status(400).send(error.message);
    }
  };
}
    export { UserController };
