import { AuthChecker } from "type-graphql";
import MyContext from "../types/myContext.js";
import { Assert } from "./assert.js";
import { AppErrors } from "./custom_error.js";
import { UserRoles } from "../schema/user.schema.js";

export const authChecker: AuthChecker<MyContext> = (
  { context },
  roles: [UserRoles]
) => {
  // Ensure the user is authenticated
  Assert.isTrue(
    !!context.user,
    "User is not authenticated",
    AppErrors.UNAUTHENTICATED
  );

  if (roles.length > 0) {
    Assert.isTrue(
      roles.includes(context.user.role as UserRoles),
      "You have no permissions for access",
      AppErrors.UNAUTHORIZED
    );
  }

  return true;
};
