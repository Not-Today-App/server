import { GraphQLError } from "graphql";

export enum AppErrors {
  "EMAIL_ALREADY_EXISTS" = "EMAIL_ALREADY_EXISTS",
  "INVALID_CREDENTIALS" = "INVALID_CREDENTIALS",
}

export class AppError extends GraphQLError {
  constructor(message: string, code: AppErrors, input?: any) {
    super(message, {
      extensions: {
        code,
        input,
      },
    });
  }
}
