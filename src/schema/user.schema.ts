import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses.js";
import { Field, ID, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";

export enum UserRoles {
  APPLICATION_USER = "APPLICATION_USER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

@ObjectType()
export class User extends TimeStamps {
  @Field(() => ID)
  _id: string;

  @Field()
  @prop({ required: true, trim: true, minlength: 3, maxlength: 30 })
  username: string;

  @Field({ nullable: true })
  @prop()
  picture?: string;

  @Field()
  @prop({ required: true, trim: true, unique: true }) // unique adds index for search performance
  email: string;

  // Avoid @Field for sensitive data
  @prop({ default: false })
  isEmailVerified: boolean;

  @prop({ required: true, minlength: 8 })
  password: string;

  @prop({ enum: UserRoles, default: UserRoles.APPLICATION_USER })
  role: UserRoles;

  static async hashPassword(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plainPassword, salt);
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export const UserModel = getModelForClass(User);
