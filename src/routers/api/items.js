const { isSymbol } = require("lodash");
const { paginate, parseQueryInteger, codes } = require("../../../lib/index");

const routes = async (fastify) => {
  fastify.get("/items", async (request, response) => {
    const totalCount = fastify.cache.items.size;
    const page_number = parseQueryInteger(request, "page_number", 1);
    const page_size = parseQueryInteger(request, "page_size", 5);

    if (page_size < 1 || page_size > 200) return response.code(400).send(codes[400]);
    if (page_number > (totalCount / page_size) + 1) return response.code(400).send(codes[400]);

    const items = paginate(Array.from(fastify.cache.items.values()), page_size, page_number);

    return response.code(200).send({
      total_count: totalCount,
      page: page_number,
      page_size: page_size,
      max_page_size: 200,
      returned: items.length,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        texture: item.texture.hash,
        action_type: item.action_type,
        texture_x: item.texture_x,
        texture_y: item.texture_y,
        main_sprite: item.texture.slices[item.texture_x][item.texture_y].toString("base64"),
        collision_type: item.collision_type,
        rarity: item.rarity,
        max_amount: item.max_amount,
        break_hits: item.break_hits
      }))
    }); 
  });
};

module.exports = routes;

// [ true, true, true, true ]
//  Up   Right  Down  Left

function getCollisions (item) {
  let collisions = {};
  if ([1, 4].includes(item.collision_type) && item.spread_type === 2) {
    collisions[[true, true, true, true]] = { texture_x: item.texture_x, texture_y: item.texture_y };
    collisions[[false, true, true, true]] = { texture_x: item.texture_x + 1, texture_y: item.texture_y };
    collisions[[true, false, false, true]] = { texture_x: item.texture_x, texture_y: item.texture_y + 1 };
    collisions[[true, true, false, true]] = { texture_x: item.texture_x + 2, texture_y: item.texture_y };
    collisions[[true, false, true, false]] = { texture_x: item.texture_x + 1, texture_y: item.texture_y + 1 };
    collisions[[false, false, true, false]] = { texture_x: item.texture_x + 2, texture_y: item.texture_y + 1 };
    collisions[[true, true, true, false]] = { texture_x: item.texture_x + 3, texture_y: item.texture_y };
    collisions[[true, false, false, false]] = { texture_x: item.texture_x + 3, texture_y: item.texture_y + 1 };
    collisions[[true, false, true, true]] = { texture_x: item.texture_x + 4, texture_y: item.texture_y };
    collisions[[false, false, false, false]] = { texture_x: item.texture_x + 4, texture_y: item.texture_y + 1 };
    collisions[[false, true, true, false]] = { texture_x: item.texture_x + 5, texture_y: item.texture_y };
    collisions[[false, false, true, true]] = { texture_x: item.texture_x + 6, texture_y: item.texture_y };
    collisions[[true, true, false, false]] = { texture_x: item.texture_x + 7, texture_y: item.texture_y };
    collisions[[false, true, false, false]] = { texture_x: item.texture_x + 5, texture_y: item.texture_y + 3 };
    collisions[[false, false, false, true]] = { texture_x: item.texture_x + 6, texture_y: item.texture_y + 3 };
    collisions[[false, true, false, true]] = { texture_x: item.texture_x + 4, texture_y: item.texture_y + 3 };    
  } else if ([1, 4].includes(item.collision_type) && item.spread_type === 5) {
    collisions[[true, true, true, true]] = { texture_x: item.texture_x, texture_y: item.texture_y };
    collisions[[false, true, true, true]] = { texture_x: item.texture_x + 1, texture_y: item.texture_y };
    collisions[[true, false, false, true]] = { texture_x: item.texture_x, texture_y: item.texture_y + 1 };
    collisions[[true, true, false, true]] = { texture_x: item.texture_x + 2, texture_y: item.texture_y };
    collisions[[true, false, true, false]] = { texture_x: item.texture_x + 1, texture_y: item.texture_y + 1 };
    collisions[[false, false, true, false]] = { texture_x: item.texture_x + 2, texture_y: item.texture_y + 1 };
    collisions[[true, true, true, false]] = { texture_x: item.texture_x + 3, texture_y: item.texture_y };
    collisions[[true, false, false, false]] = { texture_x: item.texture_x + 3, texture_y: item.texture_y + 1 };
    collisions[[true, false, true, true]] = { texture_x: item.texture_x + 4, texture_y: item.texture_y };
    collisions[[false, false, false, false]] = { texture_x: item.texture_x + 4, texture_y: item.texture_y + 1 };
    collisions[[false, true, true, false]] = { texture_x: item.texture_x + 5, texture_y: item.texture_y };
    collisions[[false, false, true, true]] = { texture_x: item.texture_x + 6, texture_y: item.texture_y };
    collisions[[true, true, false, false]] = { texture_x: item.texture_x + 7, texture_y: item.texture_y };
    collisions[[false, true, false, false]] = { texture_x: item.texture_x + 6, texture_y: item.texture_y + 1 };
    collisions[[false, false, false, true]] = { texture_x: item.texture_x + 5, texture_y: item.texture_y + 1 };
    collisions[[false, true, false, true]] = { texture_x: item.texture_x + 7, texture_y: item.texture_y + 1 };
  } else if ([1, 4].includes(item.collision_type) && item.spread_type === 1) {
    collisions = {};
  } else if ([1, 4].includes(item.collision_type) && item.spread_type === 4) {
    collisions[[true, false, false, false]] = { texture_x: item.texture + 1, texture_y: item.texture_y };
    collisions[[false, true, false, false]] = { texture_x: item.texture + 2, texture_y: item.texture_y };
    collisions[[false, false, true, false]] = { texture_x: item.texture + 3, texture_y: item.texture_y };
    collisions[[false, false, false, true]] = { texture_x: item.texture, texture_y: item.texture_y };
    collisions[[false, false, false, false]] = { texture_x: item.texture + 4, texture_y: item.texture_y };
  } else if ([1, 4].includes(item.collision_type) && item.spread_type === 3) {
    collisions[[false, true]] = { texture_x: item.texture_x, texture_y: item.texture_y };
    collisions[[true, true]] = { texture_x: item.texture_x + 1, texture_y: item.texture_y };
    collisions[[true, false]] = { texture_x: item.texture_x + 2, texture_y: item.texture_y };
    collisions[[false, false]] = { texture_x: item.texture_x + 3, texture_y: item.texture_y };
  }
}
