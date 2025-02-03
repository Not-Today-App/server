import { LevelModel } from "../schema/level.schema.js";
import { GetLevelInput } from "../types/inputs/level.input.js";

class LevelService {
  async findAll() {
    return LevelModel.find().lean();
  }

  async findByLevel(input: GetLevelInput) {
    return LevelModel.findOne({ level: input.level }).lean();
  }

  // create is made with utils/pre_populate.ts since this is static
}

export default LevelService;
