import AddictionResolver from "./addiction.resolver.js";
import DiaryResolver from "./diary.resolver.js";
import LevelResolver from "./level.resolver.js";
import UserResolver from "./user.resolver.js";
import { UserAddictionResolver } from "./user_addiction.resolver.js";

export const resolvers = [
  UserResolver,
  DiaryResolver,
  LevelResolver,
  AddictionResolver,
  UserAddictionResolver,
] as const;
