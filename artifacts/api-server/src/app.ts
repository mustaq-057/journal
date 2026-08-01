import express from "express";
import cors from "cors";
import * as pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";


const app = express() as any;

app.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (pinoHttp as any).default({
    logger,
    serializers: {
      req(req: { id: unknown; method: string; url?: string }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: { statusCode: number }) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
