import {
  Arg,
  Authorized,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
} from "type-graphql";

import UserService from "../service/user.service.js";
import { User, UserModel } from "../schema/user.schema.js";
import { LoginInput, RegisterInput } from "../types/inputs/user.input.js";
import MyContext from "../types/myContext.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";
import { getRedisClient } from "../utils/redis.js";

@Resolver(User)
class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService(getRedisClient());
  }

  // QUERIES ------------------------------------------------------------

  // TODO: Paginated users
  @Query(() => [User])
  users() {
    return this.userService.findAll();
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext) {
    const user = await UserModel.findById(context.user._id).lean();
    Assert.isTrue(!!user, "User not found", AppErrors.USER_NOT_FOUND);
    return user;
  }

  @Query(() => Int)
  countUsers() {
    return this.userService.count();
  }

  /*  @Query()
  verifyEmail() {
    return this.userService.verifyEmail();
  } */

  // MUTATIONS ------------------------------------------------------------

  @Mutation(() => String)
  register(@Arg("input") input: RegisterInput) {
    return this.userService.register(input);
  }

  @Mutation(() => String)
  async verifyEmail(@Arg("uuid") uuid: string): Promise<string> {
    return this.userService.verifyEmail(uuid);
  }

  @Mutation(() => String) // jwt
  login(@Arg("input") input: LoginInput, @Ctx() context: MyContext) {
    return this.userService.login(input, context);
  }

  //TODO: deleteMe @Authorized
  //TODO: resetPassword(newPassword)
}

export default UserResolver;
