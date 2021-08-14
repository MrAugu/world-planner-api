class Item {
  constructor (fastify, data) {
    this.fastify = fastify;
    this.id = data.id;
    this.game_id = data.game_id;
    this.action_type = data.action_type;
    this.item_category = data.item_category;
    this.name = data.name;
    this.texture = fastify.cache.textures.get(data.texture_hash);
    this.texture_name = data.texture;
    this.texture_hash = data.texture_hash;
    this.texture_x = data.texture_x;
    this.texture_y = data.texture_y;
    this.spread_type = data.spread_type;
    this.collision_type = data.collision_type;
    this.rarity = data.rarity;
    this.max_amount = data.max_amount;
    this.break_hits = data.break_hits;
  }
}

module.exports = Item;
