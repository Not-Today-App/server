import { InputType, Field } from "type-graphql";
import { AddictionName } from "../../schema/addiction.schema.js";

@InputType()
export class GetAddictionInput {
  @Field(() => AddictionName)
  name: AddictionName;
}
