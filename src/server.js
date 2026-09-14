const app = require("./app");
const environment = require("./config/environment");
const connectDatabase = require("./config/database");
const https = require("https");
const fs = require("fs");

require("./models/User");
require("./models/Event");
require("./models/Registration");
require("./models/Attendance");
require("./models/Notification");

const sslOptions = {
  key: fs.readFileSync("./ssl/backend-key.pem"),
  cert: fs.readFileSync("./ssl/backend.pem"),
};

const startServer = async () => {
  await connectDatabase();

  const server = https.createServer(sslOptions, app);

  server.listen(environment.port, "0.0.0.0", () => {
    console.log(`HTTPS server running on port ${environment.port}`);
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