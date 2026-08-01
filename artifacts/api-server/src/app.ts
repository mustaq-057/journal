import express from "express";
import cors from "cors";
import * as pinoHttp from "pino-http";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Serve API routes
app.use("/api", router);

// Serve Frontend Static Files
const frontendDistPath = path.resolve(__dirname, "../../hello-kitty-notes/dist");
app.use(express.static(frontendDistPath));

// Fallback for SPA (Single Page Application) routing
app.use((req: express.Request, res: express.Response) => {
  res.sendFile(path.resolve(frontendDistPath, "index.html"));
});

export default app;
