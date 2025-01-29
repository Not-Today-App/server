import { Request, Response } from "express";
// TODO: import { User } from "../schema/user.schema";

interface MyContext {
  //TODO: user: User | null;
  token?: string;
}

export default MyContext;
