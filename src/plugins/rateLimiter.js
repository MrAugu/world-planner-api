const fp = require("fastify-plugin");
const defaultLimitIndexPerMinute = 1;
const secondsInAMinute = 100;

async function plugin (fastify, options) { // eslint-disable-line no-unused-vars
  fastify.register(require("fastify-rate-limit"), {
    timeWindow: "1 minute",
    global: true,
    ban: 40,
    max: () => defaultLimitIndexPerMinute * secondsInAMinute,
    errorResponseBuilder: (request, response) => {
      const payload = {
        "code": 429,
        "error": "Too many requests",
        "message": "You are being rate limited."
      };
      return response.code(429).send(payload);
    }
  });
}

module.exports = fp(plugin, {
  fastify: "3.x",
  name: "ratelimit"
});