import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { User } from "../schema/user.schema.js";
import { LoginInput, RegisterInput } from "../types/inputs/auth.input.js";
import MyContext from "../types/myContext.js";
import { clearAuthCookies } from "../utils/cookies.js";
import AuthService from "../service/auth.service.js";
import { getRedisClient } from "../utils/redis.js";

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@Resolver(User)
class AuthResolver {
  constructor(private authService: AuthService) {
    this.authService = new AuthService(getRedisClient());
  }

  // MUTATIONS ------------------------------------------------------------

  @Mutation(() => String)
  register(@Arg("input") input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => LoginResponse) // jwt
  login(@Arg("input") input: LoginInput, @Ctx() context: MyContext) {
    return this.authService.login(input, context);
  }

  @Mutation(() => String)
  async verifyEmail(@Arg("uuid") uuid: string) {
    return this.authService.verifyEmail(uuid);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() context: MyContext) {
    clearAuthCookies(context.res);
    return true;
  }

  //TODO: resetPassword(newPassword)
}

export default AuthResolver;
