import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import express from "express";
import MyContext from "./types/myContext.js";
import { buildSchema } from "type-graphql";
import { authChecker } from "./utils/auth_checker.js";
import { connectToMongo } from "./utils/mongo.js";
import { verifyJwt } from "./utils/jwt.js";
import { User } from "./schema/user.schema.js";
import {
  prepopulateAddictions,
  prepopulateLevels,
} from "./utils/pre_populate.js";
import { resolvers } from "./resolver/index.js";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers,
    authChecker,
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
      context: async (ctx: MyContext) => {
        const token = ctx.req.headers.authorization;

        if (token) {
          const tokenValue = token.replace("Bearer ", "").trim();
          const user = verifyJwt<User>(tokenValue);
          ctx.user = user;
        }

        return ctx;
      },
    })
  );

  // Modified server startup with graceful shutdown
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);

  connectToMongo();
  prepopulateLevels();
  prepopulateAddictions();
}

bootstrap();
