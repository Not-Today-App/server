import { User, UserModel } from "../schema/user.schema.js";
import { LoginInput, RegisterInput } from "../types/inputs/user.input.js";
import MyContext from "../types/myContext.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";
import { signJwt } from "../utils/jwt.js";

class UserService {
  async register(input: RegisterInput) {
    const existingUser = await UserModel.findOne({ email: input.email }).exec();

    Assert.isFalse(
      !!existingUser,
      "email is already in use",
      AppErrors.EMAIL_ALREADY_EXISTS,
      input.email
    );

    return UserModel.create(input);
  }

  async login(input: LoginInput, context: MyContext) {
    const e = "Invalid email or password";

    const user = await this.findByEmail(input.email);

    Assert.isTrue(!!user, e, AppErrors.INVALID_CREDENTIALS);

    Assert.isTrue(
      !!(await User.comparePassword(input.password, user.password)),
      e,
      AppErrors.INVALID_CREDENTIALS
    );

    const payload = {
      _id: user._id,
      role: user.role,
    };

    const token = signJwt(payload);

    return token;
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email }).lean();
  }

  async findAll() {
    return UserModel.find().lean();
  }
}

export default UserService;
