const AutoLoad = require("fastify-autoload");
const fastify = require("fastify")({
  logger: false
});
const { join } = require("path");
require("dotenv").config();

(async function () {
  fastify.addHook("onSend", async (request, response) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("X-Powered-By", "MrAugu <mraugu@yahoo.com> / MrAugu#7917");
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

  process.on("uncaughtException", console.error);
  process.on("unhandledRejection", console.error);

  for (const texture of Array.from(fastify.cache.textures.values())) {
    process.stdout.write(`[Cache]: Slicing ${texture.hash} (${(texture.width / 32) * (texture.height / 32)} blocks)..`);
    await texture.createSlices();
    process.stdout.write(" OK\n");
  }

  fastify.listen(parseInt(process.env.PORT), "0.0.0.0", (error, address) => {
    if (error) throw error;
    console.log(`[Info]: Listening at ${address}.`);
  });
}());