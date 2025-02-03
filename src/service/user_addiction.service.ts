import {
  AddictionModel,
  AddictionName,
  QuitReason,
} from "../schema/addiction.schema.js";
import { UserAddictionModel } from "../schema/user_addiction.schema.js";
import {
  CreateUserAddictionInput,
  DeleteUserAddictionInput,
  GetUserAddictionInput,
  UpdateUserAddictionInput,
} from "../types/inputs/user_addiction.input.js";
import MyContext from "../types/myContext.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";

class UserAddictionService {
  async findAll(context: MyContext) {
    return UserAddictionModel.find({ userId: context.user._id }).lean();
  }

  async findByName(input: GetUserAddictionInput, context: MyContext) {
    return UserAddictionModel.findOne({
      addiction: input.addiction,
      userId: context.user._id,
    }).lean();
  }

  async create(input: CreateUserAddictionInput, context: MyContext) {
    // Validate the addiction name
    Assert.isTrue(
      Object.values(AddictionName).includes(input.addiction),
      "invalid addiction name",
      AppErrors.INVALID_ADDICTION
    );

    // Check if the user already has the same addiction
    const userAddictionExists = await UserAddictionModel.exists({
      userId: context.user._id,
      addiction: input.addiction,
    });

    Assert.isFalse(
      !!userAddictionExists,
      "can't have 2 of the same addiction",
      AppErrors.ALREADY_HAVE_ADDICTION
    );

    // Get the addiction quitReason from addiction
    const addiction = await AddictionModel.findOne(
      { name: input.addiction },
      { quitReason: 1 }
    );

    Assert.isTrue(
      !!addiction,
      "addiction not found",
      AppErrors.ADDICTION_NOT_FOUND
    );

    // Add/Remove fields based on condition
    const conditionInput = {
      ...input,
      ...(addiction.quitReason === QuitReason.MONEY && {
        costPerDay: input.costPerDay,
        timeSpentPerDay: undefined,
      }),
      ...(addiction.quitReason === QuitReason.TIME && {
        timeSpentPerDay: input.timeSpentPerDay,
        costPerDay: undefined,
      }),
      ...(addiction.quitReason === QuitReason.EVENT && {
        timeSpentPerDay: undefined,
        costPerDay: undefined,
      }),
    };

    Assert.isTrue(
      addiction.quitReason !== QuitReason.MONEY ||
        input.costPerDay !== undefined,
      `costPerDay is required when quitReason is ${addiction.quitReason}`,
      AppErrors.REQUIRED_FIELD
    );

    Assert.isTrue(
      addiction.quitReason !== QuitReason.TIME ||
        input.timeSpentPerDay !== undefined,
      `timeSpentPerDay is required when quitReason is ${addiction.quitReason}`,
      AppErrors.REQUIRED_FIELD
    );

    const userAddictionInput = { ...conditionInput, userId: context.user._id };
    return UserAddictionModel.create(userAddictionInput);
  }

  async update(input: UpdateUserAddictionInput, context: MyContext) {
    const userInput = { addiction: input.addiction, userId: context.user._id };

    const userAddiction = await UserAddictionModel.findOne(userInput);

    Assert.isTrue(
      !!userAddiction,
      "user addiction not found",
      AppErrors.USER_ADDICTION_NOT_FOUND
    );

    const addiction = await AddictionModel.findOne(
      { name: input.addiction },
      { quitReason: 1 }
    );

    Assert.isTrue(
      !!addiction,
      "addiction not found",
      AppErrors.ADDICTION_NOT_FOUND
    );

    return await UserAddictionModel.findOneAndUpdate(
      userInput,
      {
        $set: {
          ...(addiction.quitReason === QuitReason.TIME && {
            timeSpentPerDay: input.timeSpentPerDay,
          }),
          ...(addiction.quitReason === QuitReason.MONEY && {
            costPerDay: input.costPerDay,
          }),
        },
      },
      { new: true, lean: true }
    );
  }

  async delete(input: DeleteUserAddictionInput, context: MyContext) {
    const userAddictionInput = {
      addiction: input.addiction,
      userId: context.user._id,
    };

    // Check if the user addiction exists
    const userAddictionExists = await UserAddictionModel.exists(
      userAddictionInput
    );

    Assert.isTrue(
      !!userAddictionExists,
      "user addiction not found",
      AppErrors.USER_ADDICTION_NOT_FOUND
    );

    // Delete the user addiction
    await UserAddictionModel.findOneAndDelete(userAddictionInput).lean();

    return "user addiction deleted";
  }
}

export default UserAddictionService;
