const express = require("express");
const ServiceRegistry = require("./lib/serviceRegistry");
const service = express();

module.exports = (config) => {
  const log = config.log();
  const serviceRegistry = new ServiceRegistry(log);
  // Add a request logging middleware in development mode
  if (service.get("env") === "development") {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }
  service.put("/register/:name/:version/:port", (req, res) => {
    const { name, version, port } = req.params;
    const ip = req.socket.remoteAddress.includes("::")
      ? `[${req.socket.remoteAddress}]`
      : req.socket.remoteAddress;
    const serviceKey = serviceRegistry.register(name, version, ip, port);
    return res.json({ key: serviceKey });
  });
  service.delete("/unregister/:name/:version/:port", (req, res, next) => {
    const { name, version, port } = req.params;
    const ip = req.socket.remoteAddress.includes("::")
      ? `[${req.socket.remoteAddress}]`
      : req.socket.remoteAddress;
    const serviceKey = serviceRegistry.unregister(name, version, ip, port);
    return res.json({ result: `deleted service with key ${serviceKey}` });
  });
  service.get("/getregister/:name/:version", (req, res, next) => {
    const { name, version } = req.params;
    const service = serviceRegistry.get(name, version);
    return res.json({ service });
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
