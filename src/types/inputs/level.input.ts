import { InputType, Field, Int } from "type-graphql";

@InputType()
export class GetLevelInput {
  @Field(() => Int)
  level: number; // Query by level number (1-7)
}
