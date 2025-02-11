import UserResolver from "./user.resolver.js";
import AuthResolver from "./auth.resolver.js";
import AddictionResolver from "./addiction.resolver.js";
import DiaryResolver from "./diary.resolver.js";
import LevelResolver from "./level.resolver.js";
import UserAddictionResolver from "./user_addiction.resolver.js";

export const resolvers = [
  UserResolver,
  AuthResolver,
  DiaryResolver,
  LevelResolver,
  AddictionResolver,
  UserAddictionResolver,
] as const;
