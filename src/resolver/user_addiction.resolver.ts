import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import {
  CreateUserAddictionInput,
  DeleteUserAddictionInput,
  GetUserAddictionInput,
  UpdateUserAddictionInput,
} from "../types/inputs/user_addiction.input.js";
import { UserAddiction } from "../schema/user_addiction.schema.js";
import MyContext from "../types/myContext.js";
import UserAddictionService from "../service/user_addiction.service.js";

@Authorized()
@Resolver()
class UserAddictionResolver {
  constructor(private userAddictionService: UserAddictionService) {
    this.userAddictionService = new UserAddictionService();
  }

  // QUERIES ------------------------------------------------------------

  @Query(() => [UserAddiction])
  async userAddictions(@Ctx() context: MyContext) {
    return this.userAddictionService.findAll(context);
  }

  @Query(() => UserAddiction, { nullable: true })
  async userAddiction(
    @Arg("input") input: GetUserAddictionInput,
    @Ctx() context: MyContext
  ) {
    return this.userAddictionService.findByName(input, context);
  }

  // MUTATIONS -----------------------------------------------------------

  @Mutation(() => UserAddiction)
  async createUserAddiction(
    @Arg("input") input: CreateUserAddictionInput,
    @Ctx() context: MyContext
  ) {
    return this.userAddictionService.create(input, context);
  }

  @Mutation(() => UserAddiction)
  async updateUserAddiction(
    @Arg("input") input: UpdateUserAddictionInput,
    @Ctx() context: MyContext
  ) {
    return this.userAddictionService.update(input, context);
  }

  @Mutation(() => String)
  async deleteUserAddiction(
    @Arg("input") input: DeleteUserAddictionInput,
    @Ctx() context: MyContext
  ) {
    return this.userAddictionService.delete(input, context);
  }
}

export default UserAddictionResolver;
