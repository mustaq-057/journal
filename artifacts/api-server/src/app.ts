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
const ALLOWED_ORIGINS = [
  "https://withered-wind-145e.f27839058.workers.dev",
  "https://journal-1-o8np.onrender.com",
  "http://localhost:2521",
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
  "http://localhost:3001",
];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps), our specific origins, or any Vercel deployment URL
      if (!origin || ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app') || origin === 'capacitor://localhost' || origin === 'http://localhost') {
        callback(null, true);
      } else {
        callback(new Error(`CORS blocked: ${origin}`));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API routes
app.use("/api", router);

// Serve Frontend Static Files
const frontendDistPath = path.resolve(__dirname, "../../hello-kitty-notes/dist");
app.use(express.static(frontendDistPath));

// Fallback for SPA (Single Page Application) routing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((_req: any, res: any) => {
  res.sendFile(path.resolve(frontendDistPath, "index.html"));
});

export default app;
