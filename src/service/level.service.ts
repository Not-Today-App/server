import { LevelModel } from "../schema/level.schema.js";
import { GetLevelInput } from "../types/inputs/level.input.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";

class LevelService {
  async findAll() {
    return LevelModel.find().lean();
  }

  async findByLevel(input: GetLevelInput) {
    const level = LevelModel.findOne({ level: input.level }).lean();

    Assert.isTrue(
      !!level,
      "level not found",
      AppErrors.LEVEL_NOT_FOUND,
      input.level
    );
  }

  // create is made with utils/pre_populate.ts since this is static
}

export default LevelService;
