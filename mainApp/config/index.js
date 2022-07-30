const bunyan = require("bunyan");
// Load package.json
const pjs = require("../package.json");
const path = require("path");
// Get some meta info from the package.json
const { name, version } = pjs;

// Set up a logger
const getLogger = (serviceName, serviceVersion, level) =>
  bunyan.createLogger({ name: `${serviceName}:${serviceVersion}`, level });

// Configuration options for different environments
module.exports = {
  development: {
    registryUrl: "http://localhost:3000",
    name: "asd",
    version,
    data: {
      images: path.join(__dirname, "../data/images"),
      user: path.join(__dirname, "../data/user.json"),
    },
    serviceTimeout: 30,
    log: () => getLogger(name, version, "debug"),
  },
  production: {
    registryUrl: "http://localhost:3000",
    name: "asd",
    version,
    data: {
      images: path.join(__dirname, "../data/images"),
      user: path.join(__dirname, "../data/user.json"),
    },
    serviceTimeout: 30,
    log: () => getLogger(name, version, "info"),
  },
  test: {
    registryUrl: "http://localhost:3000",
    name: "asd",
    version,
    data: {
      images: path.join(__dirname, "../data/images"),
      user: path.join(__dirname, "../data/user.json"),
    },
    serviceTimeout: 30,
    log: () => getLogger(name, version, "fatal"),
  },
};
