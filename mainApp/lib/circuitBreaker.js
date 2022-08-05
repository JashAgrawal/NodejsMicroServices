const axios = require("axios");
class CircuitBreaker {
  constructor() {
    this.states = {};
    this.failureThreshold = 5;
    this.cooldownPeriod = 10;
    this.requestTimeout = 1;
  }
  onSuccess(endpoint) {
    this.initState(endpoint);
  }
  async callService(reqOptions) {
    const endpoint = `${reqOptions.method}:$${reqOptions.url}`;
    if (!this.canRequest(endpoint)) return false;
    reqOptions.timeout = this.requestTimeout * 1000;
    try {
      const res = await axios(reqOptions);
      this.onSuccess(endpoint);
      return res.data;
    } catch (err) {
      this.onFailure(endpoint);
      return false;
    }
  }
  onFailure(endpoint) {
    const state = this.states[endpoint];
    state.failures += 1;
    if (state.failures > this.failureThreshold) {
      state.circuit = "OPEN";
      state.nextTry = new Date() / 1000 + this.cooldownPeriod;
      console.log(`alert state for this endpoint ${endpoint} is open`);
    }
  }
  canRequest(endpoint) {
    if (!this.states[endpoint]) this.initState(endpoint);
    const state = this.states[endpoint];
    if (state.circuit == "CLOSED") {
      return true;
    }
    const now = new Date() / 1000;
    if (state.nextTry <= now) {
      state.circuit = "HALF";
      return true;
    }
    return false;
  }
  initState(endPoint) {
    this.states[endPoint] = {
      failures: 0,
      cooldownPeriod: this.cooldownPeriod,
      circuit: "CLOSED",
      nextTry: 0,
    };
  }
}
module.exports = CircuitBreaker;
