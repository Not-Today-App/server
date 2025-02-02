import { LevelName, LevelType } from "../schema/level.schema.js";

export const levelsData: Omit<LevelType, "_id">[] = [
  {
    name: LevelName.STARTER,
    level: 1,
    targetDuration: 0,
  },
  {
    name: LevelName.AWAKENING,
    level: 2,
    targetDuration: 7,
  },
  {
    name: LevelName.COMMITMENT,
    level: 3,
    targetDuration: 14,
  },
  {
    name: LevelName.MOMENTUM,
    level: 4,
    targetDuration: 30,
  },
  {
    name: LevelName.ENDURANCE,
    level: 5,
    targetDuration: 90,
  },
  {
    name: LevelName.MASTERY,
    level: 6,
    targetDuration: 180,
  },
  {
    name: LevelName.ENLIGHTNMENT,
    level: 7,
    targetDuration: 365,
  },
];
