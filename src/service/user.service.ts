import { UserModel } from "../schema/user.schema.js";
import { RegisterInput } from "../types/inputs/user.input.js";
import { GraphQLError } from "graphql";

class UserService {
  async register(input: RegisterInput) {
    const existingUser = await UserModel.findOne({ email: input.email }).exec();
    if (existingUser) {
      throw new GraphQLError("email is already in use", {
        extensions: {
          code: "EMAIL_ALREADY_EXISTS",
          input: input.email,
        },
      });
    }

    return UserModel.create(input);
  }

  async findAll() {
    return UserModel.find().exec();
  }
}

export default UserService;
