import { Field, InputType } from "type-graphql";
import { User } from "../../schema/user.schema.js";
import { IsEmail, Length } from "class-validator"; // Check Length

const LengthValidationMsg =
  "$property must be between $constraint1 and $constraint2 characters";

const isEmailMessage = "Not a valid email address";

@InputType()
export class RegisterInput implements Partial<User> {
  @Length(3, 30, {
    message: LengthValidationMsg,
  })
  @Field()
  username: string;

  @IsEmail({}, { message: isEmailMessage })
  @Field()
  email: string;

  @Length(8, 30, { message: LengthValidationMsg })
  @Field()
  password: string;
}

@InputType()
export class LoginInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}
