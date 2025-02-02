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

async function prepopulateCollection(model, data) {
  const isCollectionEmpty = (await model.countDocuments()) === 0;

  if (isCollectionEmpty) {
    await model.insertMany(data);
    console.log(`${model.modelName} prepopulated successfully!`);
  }
}

export async function prepopulateLevels() {
  await prepopulateCollection(LevelModel, levelsData);
}

export async function prepopulateAddictions() {
  await prepopulateCollection(AddictionModel, addictionsData);
}
