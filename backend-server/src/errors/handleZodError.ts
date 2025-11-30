import { ZodError, ZodIssue } from "zod";
import { IGenericErrorResponse } from "../interface/error";

const handleZodError = (error: ZodError): IGenericErrorResponse => {
  const errors = error.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: "Zod Error",
    errorMessages: errors,
  };
};

export default handleZodError;
