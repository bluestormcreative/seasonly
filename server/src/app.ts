import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import MongoStore from "connect-mongo";
import env from "./util/validateEnv";
import shoppingListRoutes from "./routes/shoppingLists";
import userRoutes from "./routes/users";
import { requiresAuth } from "./middleware/auth";

const app = express();

// set up request logging.
app.use(morgan("dev"));

// Set up express to accept JSON
app.use(express.json());

// Read the session data after json but before routes.
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000, // 1hr
    },
    rolling: true, // refresh cookie automatically within 1hr if user active
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

// Put all user endpoints at this URL
app.use("/api/users", userRoutes);

// Put all shoppingList endpoints at this URL and auth.
app.use("/api/shoppingLists", requiresAuth, shoppingListRoutes);

// Custom error for non-existent endpoints.
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// Express error handler.
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500; // 500 fallback.
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
