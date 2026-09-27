const app = require("./app");
const environment = require("./config/environment");
const connectDatabase = require("./config/database");
const https = require("https");
const http = require("http");
const fs = require("fs");

require("./models/User");
require("./models/Event");
require("./models/Registration");
require("./models/Attendance");
require("./models/Notification");

const startServer = async () => {
  await connectDatabase();

  let server;
  if (environment.useHttps) {
    const sslOptions = {
      key: fs.readFileSync("./ssl/backend-key.pem"),
      cert: fs.readFileSync("./ssl/backend.pem"),
    };
    server = https.createServer(sslOptions, app);
  } else {
    if (environment.nodeEnv === "production") {
      throw new Error("USE_HTTPS=false is not allowed when NODE_ENV=production");
    }
    server = http.createServer(app);
  }

  server.listen(environment.port, "0.0.0.0", () => {
    console.log(`${environment.useHttps ? "HTTPS" : "HTTP"} server running on port ${environment.port}`);
    console.log(`Environment: ${environment.nodeEnv}`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down...");

    server.close(() => {
      console.log("Server closed.");
      process.exit(0);
    });
  });
};

startServer();