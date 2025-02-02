import { AddictionModel } from "../schema/addiction.schema.js";
import { GetAddictionInput } from "../types/inputs/addiction.input.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";

class AddictionService {
  async findAll() {
    return AddictionModel.find().lean();
  }

  async findByName(input: GetAddictionInput) {
    const addiction = AddictionModel.findOne({ name: input.name }).lean();
    Assert.isTrue(
      !!addiction,
      "addiction not found",
      AppErrors.ADDICTION_NOT_FOUND,
      input.name
    );
    return addiction;
  }

  // create is made with utils/pre_populate.ts since this is static
}

export default AddictionService;
