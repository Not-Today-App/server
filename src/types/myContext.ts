import { Request, Response } from "express";
import { User } from "../schema/user.schema";

interface MyContext {
  req: Request;
  res: Response;
  user?: Partial<User>;
}

export default MyContext;
