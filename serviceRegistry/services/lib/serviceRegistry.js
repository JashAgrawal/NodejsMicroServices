const semver = require("semver");
class serviceRegistry {
  constructor(log) {
    this.log = log;
    this.services = {};
    this.timeout = 30;
  }
  register(name, version, ip, port) {
    this.cleanup();
    const key = name + version + ip + port;
    if (!this.services[key]) {
      this.services[key] = {};
      this.services[key].timestamp = Math.floor(new Date() / 1000);
      this.services[key].name = name;
      this.services[key].version = version;
      this.services[key].ip = ip;
      this.services[key].port = port;
      this.log.debug(`added service with key ${key}`);
      return key;
    }
    this.services[key].timestamp = Math.floor(new Date() / 1000);
    this.log.debug(`updated service with key ${key}`);
    return key;
  }
  get(name, version) {
    this.cleanup();
    const serviceList = Object.values(this.services).filter(
      (service) =>
        service.name === name && semver.satisfies(service.version, version)
    );
    return serviceList[Math.floor(Math.random() * serviceList.length)];
  }
  unregister(name, version, ip, port) {
    const key = name + version + ip + port;
    delete this.services[key];
    this.log.debug(`deleted service with key ${key}`);
    return key;
  }
  cleanup() {
    const now = Math.floor(new Date() / 1000);
    Object.keys(this.services).forEach((key) => {
      if (this.services[key].timestamp + this.timeout < now) {
        delete this.services[key];
        this.log.debug(`deleted service ${key}`);
      }
    });
  }
}
module.exports = serviceRegistry;
