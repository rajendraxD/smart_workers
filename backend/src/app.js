import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import env from "./config/env.js";
import morgan from "morgan";
import { morganStream } from "./config/logger.js";
import { requestContext } from "./middleware/requestContext.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

export function createApp() {
  const app = express();
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(
    express.json({ limit: "5mb" }),
    express.urlencoded({ extended: true, limit: "5mb" }),
  );
  app.use(cookieParser());
  app.use(morgan(env.isProd ? "combined" : "dev", { stream: morganStream }));
  app.use(requestContext);

  //Routes
  app.use("/api", routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
