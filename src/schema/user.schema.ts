import { getModelForClass, pre, prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses.js";
import { Field, ID, ObjectType } from "type-graphql";
import bcrypt from "bcrypt";

enum Roles {
  APPLICATION_USER = "APPLICATION_USER",
  SUPER_ADMIN = "SUPER_ADMIN",
}

// Hash password
@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(this.password, salt);
  this.password = hash;
})
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

  @prop({ required: true, minlength: 8, maxlength: 30 })
  password: string;

  @prop({ enum: Roles, default: Roles.APPLICATION_USER })
  role: string;

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export const UserModel = getModelForClass(User);
