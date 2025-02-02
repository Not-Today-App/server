import { getModelForClass, prop } from "@typegoose/typegoose";
import { Field, ID, ObjectType, registerEnumType } from "type-graphql";

// Static Schema

export enum QuitReason {
  MONEY = "MONEY",
  TIME = "TIME",
  EVENT = "EVENT",
}

export enum AddictionName {
  ALCOHOL = "ALCOHOL",
  ATTENTION_SEEKING = "ATTENTION_SEEKING",
  BAD_LANGUAGE = "BAD_LANGUAGE",
  CAFFEINE = "CAFFEINE",
  DAIRY = "DAIRY",
  DRUG = "DRUG",
  FAST_FOOD = "FAST_FOOD",
  GAMBLING = "GAMBLING",
  GAMING = "GAMING",
  NAIL_BITING = "NAIL_BITING",
  PORN = "PORN",
  PROCRASTINATION = "PROCRASTINATION",
  SELF_HARM = "SELF_HARM",
  SMOKING = "SMOKING",
  SOCIAL_MEDIA = "SOCIAL_MEDIA",
  SOFT_DRINKS = "SOFT_DRINKS",
  SUGAR = "SUGAR",
  VAPING = "VAPING",
}

registerEnumType(QuitReason, { name: "QuitReason" });
registerEnumType(AddictionName, { name: "AddictionName" });

@ObjectType()
export class Addiction {
  @Field(() => ID)
  _id: string;

  @Field(() => AddictionName)
  @prop({ enum: AddictionName, required: true })
  name: AddictionName;

  @Field(() => [String])
  @prop({ type: () => [String], required: true })
  symptoms: string[];

  @Field(() => [String])
  @prop({ type: () => [String], required: true })
  treatmentOptions: string[];

  @Field(() => [String])
  @prop({ type: () => [String], required: true })
  triggers: string[];

  @Field(() => QuitReason)
  @prop({ enum: QuitReason, required: true })
  quitReason: QuitReason;
}

export const AddictionModel = getModelForClass(Addiction);

export type AddictionType = InstanceType<typeof AddictionModel>; // for data folder
