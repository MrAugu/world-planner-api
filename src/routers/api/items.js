const { paginate, parseQueryInteger, codes, getItemSpriteArray, getItemSprite } = require("../../../lib/index");
const max_page_size = 150;
const min_page_size = 1;

const routes = async (fastify) => {
  fastify.get("/items", async (request, response) => {
    const totalCount = fastify.cache.items.size; 
    const page_number = parseQueryInteger(request, "index", 1);
    const page_size = parseQueryInteger(request, "size", 5);

    if (page_size < min_page_size || page_size > max_page_size) return response.code(400).send(codes[400]);
    if (page_number > (totalCount / page_size) + 1) return response.code(400).send(codes[400]);
    const items = paginate(Array.from(fastify.cache.items.values()), page_size, page_number);

    return response.code(200).send({
      total_count: totalCount,
      maximum_size: max_page_size,
      amount_returned: items.length,
      items: items.map(item => {
        const serializedItem = {
          id: item.id,
          name: item.name,
          texture: item.texture.hash,
          texture_x: item.texture_x,
          texture_y: item.texture_y,
          sprites_map: getItemSpriteArray(item),
          rarity: item.rarity,
          maximum_amount: item.maximum_amount,
          spread_type: item.spread_type
        };
        const itemSprite = Buffer.from(getItemSprite(item.texture, item)).toString("base64");
        if (itemSprite) serializedItem.sprite = itemSprite;
        else fastify.cache.textures.find(texture => texture.name === "tiles_page1.png").slices[1][16].toString("base64");
        return serializedItem;
      })
    }); 
  });
};

module.exports = routes;
