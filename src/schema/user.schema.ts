import { getModelForClass, prop } from "@typegoose/typegoose";

import { Field, ID, ObjectType } from "type-graphql";

enum Roles {
  APPLICATION_USER = "APPLICATION_USER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// First @ -> for GraphQL
// Second @ -> for Mongo
// last - for Typescript

@ObjectType()
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop({ required: true, trim: true, minlength: 3, maxlength: 30 })
  username: string;

  @Field({ nullable: true })
  @prop()
  picture?: string;

  @Field()
  @prop({ required: true, trim: true, unique: true })
  email: string;

  //Avoid @Field for sensitive data
  @prop({ default: false })
  isEmailVerified: boolean;

  @prop({ required: true, minlength: 8, maxlength: 30 })
  password: string;

  @prop({ enum: Roles, default: Roles.APPLICATION_USER })
  role: string;
}

export const UserModel = getModelForClass(User);
