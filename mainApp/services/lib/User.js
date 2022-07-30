const axios = require("axios");
class UserService {
  constructor(serviceRegistryUrl, serviceVersion) {
    this.serviceRegistryUrl = serviceRegistryUrl;
    this.serviceVersion = serviceVersion;
    this.cache = {};
  }

  async getNames() {
    const res = await this.getService("asd");
    const { ip, port } = res.service;
    return await this.callService({
      method: "get",
      url: `http://${ip}:${port}/getnames`,
    });
  }

  async getService(serviceName) {
    const res = await axios.get(
      `${this.serviceRegistryUrl}/getregister/${serviceName}/${this.serviceVersion}`
    );
    return res.data;
  }

  async callService(reqOptions) {
    const res = await axios(reqOptions);
    return res.data;
  }
}

module.exports = UserService;
