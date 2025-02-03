/* 
Some schemas are static, meaning they are set once and do not change over time. 
This file is responsible for prepopulating those schemas with predefined data 
to ensure consistency and immutability.
This is runs during application startup.
*/

import { addictionsData } from "../data/addiction.data.js";
import { levelsData } from "../data/level.data.js";
import { AddictionModel } from "../schema/addiction.schema.js";
import { LevelModel } from "../schema/level.schema.js";

export async function prepopulateLevels() {
  const isCollectionEmpty = (await LevelModel.countDocuments()) === 0;

  if (isCollectionEmpty) {
    await LevelModel.insertMany(levelsData);
    console.log("Levels prepopulated successfully!");
  }
}

export async function prepopulateAddictions() {
  const isCollectionEmpty = (await AddictionModel.countDocuments()) === 0;

  if (isCollectionEmpty) {
    await AddictionModel.insertMany(addictionsData);
    console.log("Addictions prepopulated successfully!");
  }
}
