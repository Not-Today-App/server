import {
  Arg,
  Authorized,
  Ctx,
  Field,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

import UserService from "../service/user.service.js";
import { User, UserModel } from "../schema/user.schema.js";
import { LoginInput, RegisterInput } from "../types/inputs/auth.input.js";
import MyContext from "../types/myContext.js";
import { getRedisClient } from "../utils/redis.js";
import { clearAuthCookies } from "../utils/cookies.js";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@Resolver(User)
class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
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
    return this.userService.me(context);
  }

  @Query(() => Int)
  countUsers() {
    return this.userService.count();
  }

  // MUTATIONS ------------------------------------------------------------

  //TODO: deleteMe @Authorized
}

export default UserResolver;
