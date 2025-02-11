import { UserModel } from "../schema/user.schema.js";
import MyContext from "../types/myContext.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";

class UserService {
  async me(context: MyContext) {
    const user = await UserModel.findById(context.user._id).lean();
    Assert.isTrue(!!user, "User not found", AppErrors.USER_NOT_FOUND);
    return user;
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email }).lean();
  }

  async findAll() {
    return UserModel.find().lean();
  }

  async count() {
    return UserModel.estimatedDocumentCount();
  }
}

export default UserService;
