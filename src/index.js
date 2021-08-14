const AutoLoad = require("fastify-autoload");
const fastify = require("fastify")({
  logger: false
});
const { join } = require("path");
require("dotenv").config();

(async function () {
  fastify.addHook("onSend", async (request, response) => {
    response.header("Access-Control-Allow-Credentials", true);
    response.header("X-Made-By", "MrAugu <mraugu@yahoo.com> / MrAugu#7917");
  });
  
  await fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: {}
  });
  
  await fastify.register(AutoLoad, {
    dir: join(__dirname, "routers"),
    options: {}
  });

  fastify.setNotFoundHandler({
    preHandler: fastify.rateLimit()
  }, async (request, response) => {
    response.code(404).send({ "you are": "idiot" });
  }); // eslint-disable-line

  fastify.listen(parseInt(process.env.PORT), "0.0.0.0", (error, address) => {
    if (error) throw error;
    console.log(`[Info]: Listening at ${address}.`);
  });
}());