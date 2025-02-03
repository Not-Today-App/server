import { Field, InputType, Int, Float } from "type-graphql";
import { AddictionName } from "../../schema/addiction.schema.js";
import { IsPositive, Max } from "class-validator";

const MaxLengthValidationMsg = "max number is 1000";

@InputType()
export class GetUserAddictionInput {
  @Field()
  addiction: AddictionName;
}

@InputType()
export class CreateUserAddictionInput {
  @Field(() => AddictionName)
  addiction: AddictionName;

  @IsPositive()
  @Max(1000, { message: MaxLengthValidationMsg })
  @Field(() => Float, { nullable: true })
  costPerDay?: number;

  @IsPositive()
  @Max(1000, { message: MaxLengthValidationMsg })
  @Field(() => Int, { nullable: true })
  timeSpentPerDay?: number;

  //@Field(() => [String], { nullable: true })
  //motivation?: string[];
}

@InputType()
export class UpdateUserAddictionInput {
  @Field(() => AddictionName)
  addiction: AddictionName;

  @IsPositive()
  @Max(1000, { message: MaxLengthValidationMsg })
  @Field(() => Float, { nullable: true })
  costPerDay?: number;

  @IsPositive()
  @Max(1000, { message: MaxLengthValidationMsg })
  @Field(() => Int, { nullable: true })
  timeSpentPerDay?: number;
}

@InputType()
export class DeleteUserAddictionInput {
  @Field(() => AddictionName)
  addiction: AddictionName;
}
