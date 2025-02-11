import { User, UserModel } from "../schema/user.schema.js";
import { LoginInput, RegisterInput } from "../types/inputs/auth.input.js";
import MyContext from "../types/myContext.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";
import { signJwt } from "../utils/jwt.js";
import { config } from "../utils/env_loader.js";
import { SignOptions } from "jsonwebtoken";
import { setAuthCookies } from "../utils/cookies.js";
import Redis from "ioredis";
import { v4 as uuidv4 } from "uuid";
import { getTransport } from "../mail/transport.js";
import { generateVerificationEmail } from "../mail/verify_account.js";
import nodemailer from "nodemailer";

class AuthService {
  constructor(private redisClient: Redis) {
    this.redisClient = redisClient;
  }
  async login(input: LoginInput, context: MyContext) {
    const e = "Invalid email or password";

    const user = await UserModel.findOne({ email: input.email }).lean();

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

    const accessToken = signJwt(payload, {
      expiresIn: config.ACCESS_TOKEN_TTL as SignOptions["expiresIn"],
    });

    const refreshToken = signJwt(payload, {
      expiresIn: config.REFRESH_TOKEN_TTL as SignOptions["expiresIn"],
    });

    setAuthCookies({
      res: context.res,
      accessToken,
      refreshToken,
    });

    return { accessToken, refreshToken };
  }

  async register(input: RegisterInput) {
    const existingUser = await UserModel.exists({ email: input.email }).exec();

    Assert.isFalse(
      !!existingUser,
      "email is already in use",
      AppErrors.EMAIL_ALREADY_EXISTS,
      input.email
    );

    const hashedPass = await UserModel.hashPassword(input.password);

    const key = uuidv4();
    const userObj = {
      username: input.username,
      email: input.email,
      hashedPass,
    };

    await this.redisClient
      .multi()
      .hmset(key, userObj)
      .expire(key, 60 * 60) // 1 hour to verify account
      .exec();

    const transport = await getTransport();

    const mailOptions = generateVerificationEmail({
      username: input.username,
      email: input.email,
      uuid: key,
    });

    transport.sendMail(mailOptions).then((info) => {
      config.NODE_ENV === "development" &&
        console.log(`URL: ${nodemailer.getTestMessageUrl(info)}`);
    });
    return "Account created. Please verify it in your email";
  }

  async verifyEmail(uuid: string): Promise<string> {
    const redisResult = await this.redisClient
      .multi()
      .hgetall(uuid)
      .del(uuid)
      .exec();

    // Check for Redis errors
    if (redisResult[0][0]) {
      throw new Error(redisResult[0][0].toString());
    }

    const cachedAccount = redisResult[0][1] as {
      username: string;
      email: string;
      hashedPass: string;
    };

    // Validate cached account data
    if (
      !cachedAccount.username ||
      !cachedAccount.email ||
      !cachedAccount.hashedPass
    ) {
      throw new Error("Invalid or expired verification link.");
    }

    // Create the user in MongoDB
    const user = await UserModel.create({
      username: cachedAccount.username,
      email: cachedAccount.email,
      password: cachedAccount.hashedPass,
      isEmailVerified: true,
    });

    return `User ${user.username} verified and created successfully!`;
  }
}

export default AuthService;
