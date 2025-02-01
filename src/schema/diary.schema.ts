import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses.js";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";
import { User } from "./user.schema.js";
import { Assert } from "../utils/assert.js";
import { AppErrors } from "../utils/custom_error.js";

export enum DiaryMood {
  HAPPY = "HAPPY",
  RELAXED = "RELAXED",
  PROUD = "PROUD",
  HOPEFUL = "HOPEFUL",
  NEUTRAL = "NEUTRAL",
  SAD = "SAD",
  ANXIOUS = "ANXIOUS",
  TIRED = "TIRED",
  ANGRY = "ANGRY",
  OVERWHELMED = "OVERWHELMED",
  CALM = "CALM",
  CONFUSED = "CONFUSED",
  EXCITED = "EXCITED",
  GRATEFUL = "GRATEFUL",
  LONELY = "LONELY",
}

registerEnumType(DiaryMood, { name: "DiaryMood" });

// Check if a diary on that same day is added
@pre<Diary>("save", async function () {
  if (!this.isModified("createdAt")) {
    return;
  }

  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));

  const sameDayDiary = await DiaryModel.findOne({
    userId: this.userId,
    createdAt: { $gte: startOfDay },
  });

  Assert.isFalse(
    !!sameDayDiary,
    "you already created a diary today",
    AppErrors.SAME_DAY_DIARY
  );
})
@ObjectType()
export class Diary extends TimeStamps {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @prop({ required: true, ref: () => User })
  userId: Ref<User>;

  @Field()
  @prop({ required: true, trim: true, maxlength: 30 })
  title: string;

  @Field({ nullable: true })
  @prop({ maxlength: 255 })
  content?: string;

  @Field(() => DiaryMood)
  @prop({ enum: DiaryMood, default: DiaryMood.NEUTRAL })
  mood: DiaryMood;
}

export const DiaryModel = getModelForClass(Diary);
