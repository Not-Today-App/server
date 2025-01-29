import { Query, Resolver } from "type-graphql";
import { User } from "../schema/user.schema";
import UserService from "../service/user.service";

@Resolver(User)
class UserResolver {
  //constructor(private userService: UserService) {} //TODO: Add MongoDB
  private usersCollection: User[] = [
    {
      _id: "1",
      name: "John Doe",
      picture: "http://example.com/john.jpg",
      email: "johndoe@example.com",
      isEmailVerified: true,
      password: "hashedpassword123",
      role: "APPLICATION_USER",
    },
  ];

  @Query(() => [User])
  users() {
    return this.usersCollection;
  }
}

export default UserResolver;
