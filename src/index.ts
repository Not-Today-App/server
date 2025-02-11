import "reflect-metadata";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import http from "http";
import cors from "cors";
import express, { Request, Response } from "express";
import MyContext from "./types/myContext.js";
import { buildSchema } from "type-graphql";
import { authChecker } from "./utils/auth_checker.js";
import { connectToMongo } from "./utils/mongo.js";
import {
  prepopulateAddictions,
  prepopulateLevels,
} from "./utils/pre_populate.js";
import { resolvers } from "./resolver/index.js";
import { getRedisClient } from "./utils/redis.js";
import { setupGoogleOAuthRoutes } from "./oauth/google.oauth.js";
import { getUserFromToken } from "./utils/cookies.js";
import cookieParser from "cookie-parser";

async function bootstrap() {
  const schema = await buildSchema({
    resolvers,
    authChecker,
    validate: true, // Enable 'class-validator'
  });

  const app = express();

  setupGoogleOAuthRoutes(app);

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
    cors<cors.CorsRequest>({
      origin: "http://localhost:3000/graphql", // TODO: in future use local host from front end (from config)
      credentials: true,
    }),
    express.json(),
    cookieParser(),
    expressMiddleware(server, {
      context: async ({
        req,
        res,
      }: {
        req: Request;
        res: Response;
      }): Promise<MyContext> => {
        const user = await getUserFromToken(req, res);
        return { req, res, user }; // Returns the full context
      },
    })
  );
  // Modified server startup with graceful shutdown
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 3000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`); // docker forwards to port 4000

  getRedisClient();
  connectToMongo();
  prepopulateLevels();
  prepopulateAddictions();
}

bootstrap();
