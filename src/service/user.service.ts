import { User, UserModel } from "../schema/user.schema.js";
import { LoginInput, RegisterInput } from "../types/inputs/user.input.js";
import MyContext from "../types/myContext.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";
import { signJwt } from "../utils/jwt.js";
import { getTransport } from "../mail/transport.js";
import { generateVerificationEmail } from "../mail/verify_account.js";
import nodemailer from "nodemailer";
import { config } from "../utils/env_loader.js";

class UserService {
  async register(input: RegisterInput) {
    const existingUser = await UserModel.exists({ email: input.email }).exec();

    Assert.isFalse(
      !!existingUser,
      "email is already in use",
      AppErrors.EMAIL_ALREADY_EXISTS,
      input.email
    );

    const transport = await getTransport();

    const mailOptions = generateVerificationEmail({
      username: input.username,
      email: input.email,
    });

    transport.sendMail(mailOptions).then((info) => {
      config.NODE_ENV === "development" &&
        console.log(`URL: ${nodemailer.getTestMessageUrl(info)}`);
    });
    return UserModel.create(input);
  }

  async verifyEmail(context: MyContext) {
    this.findByEmail(context.user.email);
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

    Assert.isTrue(
      user.isEmailVerified,
      "Please verify your email",
      AppErrors.EMAIL_NOT_VERIFIED
    );

    const payload = {
      _id: user._id,
      role: user.role,
    };

    const token = signJwt(payload);

    return token;

    //TODO: Cookies I will need context for that
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
