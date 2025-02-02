import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, Int, ObjectType, registerEnumType } from "type-graphql";

// Static Schema

export enum LevelName {
  STARTER = "STARTER",
  AWAKENING = "AWAKENING",
  COMMITMENT = "COMMITMENT",
  MOMENTUM = "MOMENTUM",
  ENDURANCE = "ENDURANCE",
  MASTERY = "MASTERY",
  ENLIGHTNMENT = "ENLIGHTNMENT",
}

registerEnumType(LevelName, { name: "LevelName" });

@ObjectType()
export class Level {
  @Field(() => ID)
  _id: string;

  @Field(() => LevelName)
  @prop({ enum: LevelName, required: true })
  name: LevelName;

  @Field(() => Int)
  @prop({ required: true, min: 1, max: 7, unique: true }) // unique adds index for search performance
  level: number;

  @Field(() => Int)
  @prop({ required: true })
  target_duration: number; // Days: 0d, 7d, 14d, 30d, 90d, 180d, 365d
}

export const LevelModel = getModelForClass(Level);
