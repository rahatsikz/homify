import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import httpStatus from "http-status";
import routes from "./app/routes/v1";
import session from "express-session";
import config from "./config";

const app: Application = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "homify.sid", // cookie name
    secret: config.session_secret!,
    resave: false, // only save when session is modified
    saveUninitialized: false, // don't create session until something is stored
    cookie: {
      httpOnly: true, // JS can’t read the cookie
      secure: process.env.NODE_ENV === "production" ? true : false, // set to true if you serve over HTTPS
      maxAge: 24 * 60 * 60 * 1000, // expires in 1 day
    },
  })
);

// route
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Welcome to Homify Server API",
  });
});

// global error handler
app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: "Api not found",
    errorMessages: [{ path: req.originalUrl, message: "Api not found" }],
  });
});

export default app;
