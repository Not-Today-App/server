/* 
Some schemas are static, meaning they are set once and do not change over time. 
This file is responsible for prepopulating those schemas with predefined data 
to ensure consistency and immutability.
This is runs during application startup.
*/

import { LevelModel } from "../schema/level.schema.js";
import { LevelName } from "../schema/level.schema.js";

const levelsData = [
  {
    name: LevelName.STARTER,
    level: 1,
    target_duration: 0,
  },
  {
    name: LevelName.AWAKENING,
    level: 2,
    target_duration: 7,
  },
  {
    name: LevelName.COMMITMENT,
    level: 3,
    target_duration: 14,
  },
  {
    name: LevelName.MOMENTUM,
    level: 4,
    target_duration: 30,
  },
  {
    name: LevelName.ENDURANCE,
    level: 5,
    target_duration: 90,
  },
  {
    name: LevelName.MASTERY,
    level: 6,
    target_duration: 180,
  },
  {
    name: LevelName.ENLIGHTNMENT,
    level: 7,
    target_duration: 365,
  },
];

export async function prepopulateLevels() {
  const isCollectionEmpty = (await LevelModel.countDocuments()) === 0;

  if (isCollectionEmpty) {
    await LevelModel.insertMany(levelsData);
    console.log("Levels prepopulated successfully!");
  }
}
