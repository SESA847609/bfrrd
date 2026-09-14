const app = require("./app");
const environment = require("./config/environment");
const connectDatabase = require("./config/database");

require("./models/User");
require("./models/Event");
require("./models/Registration");
require("./models/Attendance");
require("./models/Notification");

const startServer = async () => {
  await connectDatabase();

  const port = process.env.PORT || environment.port || 3000;

  const server = app.listen(port, "0.0.0.0", () => {
    console.log(`HTTP server running on port ${port}`);
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

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});