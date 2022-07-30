const express = require("express");
const UserService = require("./lib/User");
const service = express();

module.exports = (config) => {
  const log = config.log();
  const userService = new UserService(config.registryUrl, config.version);
  // Add a request logging middleware in development mode
  if (service.get("env") === "development") {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }
  service.get("/getnames", async (req, res) => {
    const names = await userService.getNames();
    return res.json({ result: names });
  });

  service.use((error, req, res, next) => {
    res.status(error.status || 500);
    // Log out the error to the console
    log.error(error);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
  return service;
};
