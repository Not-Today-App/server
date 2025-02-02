import { DiaryModel, DiaryMood } from "../schema/diary.schema.js";
import {
  CreateDiaryInput,
  DeleteDiaryInput,
  GetDiaryInput,
  UpdateDiaryInput,
} from "../types/inputs/diary.input.js";
import MyContext from "../types/myContext.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";

class DiaryService {
  async findAll(context: MyContext) {
    return DiaryModel.find({ userId: context.user._id }).lean();
  }

  async findById(input: GetDiaryInput, context: MyContext) {
    return DiaryModel.findOne({
      _id: input._id,
      userId: context.user._id,
    }).lean();
  }

  async create(input: CreateDiaryInput, context: MyContext) {
    Assert.isTrue(
      Object.values(DiaryMood).includes(input.mood),
      "invalid mood",
      AppErrors.INVALID_MOOD
    );

    const diaryInput = { ...input, userId: context.user._id };
    return DiaryModel.create(diaryInput);
  }

  async update(input: UpdateDiaryInput, context: MyContext) {
    const { _id, ...updateData } = input;
    const diaryInput = { _id, userId: context.user._id };

    const diaryExists = await DiaryModel.exists(diaryInput);

    Assert.isTrue(!!diaryExists, "Diary not found", AppErrors.DIARY_NOT_FOUND);

    const updatedDiary = await DiaryModel.findByIdAndUpdate(
      diaryInput,
      { $set: updateData },
      { new: true }
    ).lean();

    return updatedDiary;
  }

  async delete(input: DeleteDiaryInput, context: MyContext) {
    const diaryInput = { _id: input._id, userId: context.user._id };

    const diaryExists = await DiaryModel.exists(diaryInput);

    Assert.isTrue(!!diaryExists, "diary not found", AppErrors.DIARY_NOT_FOUND);

    await DiaryModel.findOneAndDelete(diaryInput).lean();

    return "Diary deleted";
  }
}

export default DiaryService;
