import { MaxLength } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";

// @Something -> for graphQL
// the other -> for typescript

@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @MaxLength(30)
  name: string;

  @Field({ nullable: true })
  picture?: string;

  @Field()
  email: string;

  //TODO default false
  //Avoid @Type for sensitive data
  isEmailVerified: boolean;

  password: string;

  role: string; //TODO: ENUM -> APPLICATION_USER, SUPER_ADMIN
}
