import { Arg, Mutation, Query, Resolver } from "type-graphql";

import UserService from "../service/user.service.js";
import { User } from "../schema/user.schema.js";
import { LoginInput, RegisterInput } from "../types/inputs/user.input.js";

@Resolver(User)
class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Query(() => [User])
  users() {
    return this.userService.findAll();
  }

  @Mutation(() => User)
  register(@Arg("input") input: RegisterInput) {
    return this.userService.register(input);
  }

  @Mutation(() => String!) // jwt
  login(@Arg("input") input: LoginInput) {
    return this.userService.login(input);
  }
}

export default UserResolver;
