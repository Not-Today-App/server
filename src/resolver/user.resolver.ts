import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import UserService from "../service/user.service.js";
import { User, UserModel, UserRoles } from "../schema/user.schema.js";
import { LoginInput, RegisterInput } from "../types/inputs/user.input.js";
import MyContext from "../types/myContext.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";

@Resolver(User)
class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Query(() => [User]!)
  users() {
    return this.userService.findAll();
  }

  @Mutation(() => User!)
  register(@Arg("input") input: RegisterInput) {
    return this.userService.register(input);
  }

  @Mutation(() => String!) // jwt
  login(@Arg("input") input: LoginInput, @Ctx() context: MyContext) {
    return this.userService.login(input, context);
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext) {
    const user = await UserModel.findById(context.user._id).lean();
    Assert.isTrue(!!user, "User not found", AppErrors.USER_NOT_FOUND);
    return user;
  }
}

export default UserResolver;
