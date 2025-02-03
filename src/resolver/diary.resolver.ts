import { Resolver, Arg, Authorized, Ctx, Query, Mutation } from "type-graphql";
import MyContext from "../types/myContext.js";
import { Diary } from "../schema/diary.schema.js";
import DiaryService from "../service/diary.service.js";
import {
  CreateDiaryInput,
  DeleteDiaryInput,
  GetDiaryInput,
  UpdateDiaryInput,
} from "../types/inputs/diary.input.js";

@Authorized()
@Resolver(Diary)
class DiaryResolver {
  constructor(private diaryService: DiaryService) {
    this.diaryService = new DiaryService();
  }

  // QUERIES ------------------------------------------------------------

  // TODO: Paginated diaries
  @Query(() => [Diary])
  diaries(@Ctx() context: MyContext) {
    return this.diaryService.findAll(context);
  }

  @Query(() => Diary, { nullable: true })
  diary(@Arg("input") input: GetDiaryInput, @Ctx() context: MyContext) {
    return this.diaryService.findById(input, context);
  }

  // MUTATIONS -----------------------------------------------------------

  @Mutation(() => Diary)
  async createDiary(
    @Arg("input") input: CreateDiaryInput,
    @Ctx() context: MyContext
  ) {
    return this.diaryService.create(input, context);
  }

  @Mutation(() => Diary)
  async updateDiary(
    @Arg("input") input: UpdateDiaryInput,
    @Ctx() context: MyContext
  ) {
    return this.diaryService.update(input, context);
  }

  // Delete a diary
  @Mutation(() => String)
  async deleteDiary(
    @Arg("input") input: DeleteDiaryInput,
    @Ctx() context: MyContext
  ) {
    return this.diaryService.delete(input, context);
  }
}

export default DiaryResolver;
