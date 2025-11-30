import { Prisma } from "@prisma/client";
import {
  IGenericErrorMessage,
  IGenericErrorResponse,
} from "../interface/error";

const handleClientError = (
  error: Prisma.PrismaClientKnownRequestError
): IGenericErrorResponse => {
  let errors: IGenericErrorMessage[] = [];
  const statusCode = 400;
  let message = "";

  if (error.code === "P2025") {
    message = (error.meta?.cause as string) || "Record not found !";
    errors = [
      {
        path: "",
        message: message,
      },
    ];
  } else if (error.code === "P2003") {
    if (error.message.includes("delete()` invocation:")) {
      message = "Delete Failed";
      errors = [
        {
          path: "",
          message: message,
        },
      ];
    }
  }

  return {
    statusCode,
    message,
    errorMessages: errors,
  };
};

export default handleClientError;
