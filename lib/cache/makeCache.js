const Texture = require("../structures/Texture");
const Item = require("../structures/Item");

async function makeTextureCache (fastify) {
  const [rows] = await fastify.db.query("SELECT * FROM `textures`");
  for (const row of rows) fastify.cache.textures.set(row.hash, new Texture(row));
}

async function makeItemCache (fastify) {
  const [rows] = await fastify.db.query("SELECT * FROM `items`");
  for (const row of rows) fastify.cache.items.set(row.game_id, new Item(fastify, row));
}

module.exports = { makeTextureCache, makeItemCache };
