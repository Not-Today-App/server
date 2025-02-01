import { InputType, Field } from "type-graphql";
import { Diary, DiaryMood } from "../../schema/diary.schema.js";
import { MaxLength } from "class-validator";

const MaxLengthValidationMsg =
  "$property must be less than $constraint1 characters";

@InputType()
export class GetDiaryInput {
  @Field()
  _id: string;
}

@InputType()
export class CreateDiaryInput implements Partial<Diary> {
  @MaxLength(30, { message: MaxLengthValidationMsg })
  @Field()
  title: string;

  @MaxLength(255, { message: MaxLengthValidationMsg })
  @Field()
  content?: string;

  @Field(() => DiaryMood)
  mood: DiaryMood;
}

@InputType()
export class UpdateDiaryInput {
  @Field()
  _id: string;

  @Field({ nullable: true })
  @MaxLength(30, { message: MaxLengthValidationMsg })
  title?: string;

  @Field({ nullable: true })
  @MaxLength(255, { message: MaxLengthValidationMsg })
  content?: string;

  @Field(() => DiaryMood, { nullable: true })
  mood?: DiaryMood;
}

@InputType()
export class DeleteDiaryInput {
  @Field()
  _id: string;
}
