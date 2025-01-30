import { Arg, Mutation, Query, Resolver } from "type-graphql";

import UserService from "../service/user.service.js";
import { User } from "../schema/user.schema.js";
import { RegisterInput } from "../types/inputs/user.input.js";

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
}

export default UserResolver;
