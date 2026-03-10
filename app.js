import express from "express";
import morgan from "morgan";
import cors from "cors";
import { corsOptions } from "./config/cors.config.js";
import { homeRouter } from "./routes/index.js";
import { MESSAGE, STATUS_CODES } from "./common/index.js";

const app = express();

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", homeRouter);

app.use((req, res) => {
  res.status(STATUS_CODES.NOT_FOUND).json({
    status: STATUS_CODES.NOT_FOUND,
    error: `page for url ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    error: MESSAGE.INTERNAL_SERVER_ERROR,
  });
});

export default app;
