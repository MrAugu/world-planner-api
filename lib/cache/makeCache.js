const Texture = require("../structures/Texture");
const Item = require("../structures/Item");

async function makeTextureCache (fastify) {
  process.stdout.write("[Cache]: Creating texture cache.. ");
  const [rows] = await fastify.db.query("SELECT * FROM `textures`");
  for (const row of rows) {
    const instance = new Texture(row);
    fastify.cache.textures.set(row.hash, instance);
  }
  process.stdout.write("OK\n");
}

async function makeItemCache (fastify) {
  process.stdout.write("[Cache]: Creating items cache.. ");
  const [rows] = await fastify.db.query("SELECT * FROM `items`");
  for (const row of rows) fastify.cache.items.set(row.game_id, new Item(fastify, row));
  process.stdout.write("OK\n");
}

module.exports = { makeTextureCache, makeItemCache };
