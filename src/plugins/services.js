const fp = require("fastify-plugin");
const mysql = require("mysql2/promise");
const { makeTextureCache, makeItemCache } = require("../../lib/index");
const Collection = require("@modcord/collection");

async function plugin (fastify) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  fastify.decorate("db", connection);
  fastify.decorate("cache", {
    textures: new Collection(),
    items: new Collection()
  });
  await makeTextureCache(fastify);
  await makeItemCache(fastify);
}

module.exports = fp(plugin, {
  fastify: "3.x",
  name: "services"
});