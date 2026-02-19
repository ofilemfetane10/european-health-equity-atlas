import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { syncEurostatYear } from "../sync/eurostat";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  /**
   * Simple REST sync endpoint (optional).
   * Designed for cron/GitHub Actions without needing a tRPC client.
   *
   * POST /api/sync/eurostat
   * Headers: x-sync-token: <SYNC_TOKEN>
   * Body: { "year": 2024 }
   */
  app.post("/api/sync/eurostat", async (req, res) => {
    const token = String(req.headers["x-sync-token"] ?? "");
    const expected = process.env.SYNC_TOKEN;
    if (!expected || token !== expected) {
      return res.status(401).json({ ok: false, error: "Sync not enabled or invalid token" });
    }
    const year = Number(req.body?.year);
    if (!Number.isInteger(year)) {
      return res.status(400).json({ ok: false, error: "Body must include integer year" });
    }
    const result = await syncEurostatYear(year);
    res.status(result.ok ? 200 : 500).json(result);
  });
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
