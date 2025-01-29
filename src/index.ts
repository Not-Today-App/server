import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import express from "express";
import MyContext from "./types/myContext";
import {
  buildSchema,
  Field,
  ID,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
/* import UserResolver from "./resolver/user.resolver"; */
import { MaxLength } from "class-validator";
/* import { User } from "./schema/user.schema"; */

@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @MaxLength(30)
  name: string;

  @Field({ nullable: true })
  picture?: string;

  @Field()
  email: string;

  //TODO default false
  //Avoid @Type for sensitive data
  isEmailVerified: boolean;

  password: string;

  role: string; //TODO: ENUM -> APPLICATION_USER, SUPER_ADMIN
}

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

async function bootstrap() {
  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: true, // Enable 'class-validator'
  });

  const app = express();

  // "Drain" server (gracefully shut it down)
  const httpServer = http.createServer(app);

  const server = new ApolloServer<MyContext>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Mount Apollo Server middleware to the /graphql path
  app.use(
    "/graphql",
    cors<cors.CorsRequest>(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  // Modified server startup with graceful shutdown
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}

bootstrap();
