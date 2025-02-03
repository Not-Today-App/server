import { getModelForClass, pre, prop, Ref } from "@typegoose/typegoose";
import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { User } from "./user.schema.js";
import { Addiction, AddictionName } from "./addiction.schema.js";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses.js";

@ObjectType()
export class UserAddiction extends TimeStamps {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @prop({ required: true, ref: () => User })
  userId: Ref<User>;

  @Field(() => AddictionName)
  @prop({ enum: AddictionName, required: true })
  addiction: AddictionName; // same as in name for addiction

  @Field(() => Float, { nullable: true })
  @prop()
  costPerDay?: number;

  @Field(() => Int, { nullable: true })
  @prop()
  timeSpentPerDay?: number; // Store as total minutes (e.g., 105 for 1h45)

  //TODO: In future make this property @authrozied, due to needing to be a premium user
  @Field(() => [String], { nullable: true })
  @prop({ type: () => [String], default: [] }) // list of images
  motivation?: string[];
}

export const UserAddictionModel = getModelForClass(UserAddiction);
