const { paginate, parseQueryInteger, codes } = require("../../../lib/index");

const routes = async (fastify) => {
  fastify.get("/items", async (request, response) => {
    const max_page_size = 400;
    const min_page_size = 1;
  
    const totalCount = fastify.cache.items.size;
    const page_number = parseQueryInteger(request, "page_number", 1);
    const page_size = parseQueryInteger(request, "page_size", 5);

    if (page_size < min_page_size || page_size > max_page_size) return response.code(400).send(codes[400]);
    if (page_number > (totalCount / page_size) + 1) return response.code(400).send(codes[400]);
    const items = paginate(Array.from(fastify.cache.items.values()), page_size, page_number);

    return response.code(200).send({
      total_count: totalCount,
      page_number: page_number,
      page_size: page_size,
      maximum_size: max_page_size,
      minimum_size: min_page_size,
      amount_returned: items.length,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        texture_hash: item.texture.hash,
        texture_x: item.texture_x,
        texture_y: item.texture_y,
        sprite: item.texture.slices[item.texture_x][item.texture_y].toString("base64"),
        sprites_map: getItemSpriteArray(item),
        rarity: item.rarity,
        maximum_amount: item.max_amount,
        hardness: item.break_hits,
        spread_type: item.spread_type
      }))
    }); 
  });
};

module.exports = routes;

function getItemSpriteArray (item) {
  const spreads = getSpread(item);
  for (const spread of Object.keys(spreads)) {
    spreads[spread] = Object.assign(spreads[spread], { data: item.texture.slices[spreads[spread].texture_x][spreads[spread].texture_y].toString("base64") });
  }
  return spreads;
}


// [ true, true, true, true ]
//  Up   Right  Down  Left

function getSpread (item) {
  let collisions = {};
  if (item.spread_type === 2) {
    // All ways with 47
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
  } else if (item.spread_type === 5) {
    // All ways, but has only 16
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
  } else if (item.spread_type === 1) {
    // No collisions
    collisions = {};
  } else if (item.spread_type === 4) {
    // Attaches on a single side bassed if theres a block in that or none
    // direction, can be - in either of - in the order of priority: down, up, left, right or none
    collisions[[true, false, false, false]] = { texture_x: item.texture_x + 1, texture_y: item.texture_y };
    collisions[[false, true, false, false]] = { texture_x: item.texture_x + 2, texture_y: item.texture_y };
    collisions[[false, false, true, false]] = { texture_x: item.texture_x + 3, texture_y: item.texture_y };
    collisions[[false, false, false, true]] = { texture_x: item.texture_x, texture_y: item.texture_y };
    collisions[[false, false, false, false]] = { texture_x: item.texture_x + 4, texture_y: item.texture_y };
  } else if (item.spread_type === 3) {
    // Collisions Leftways/Rightways
    collisions[[false, true]] = { texture_x: item.texture_x, texture_y: item.texture_y };
    collisions[[true, true]] = { texture_x: item.texture_x + 1, texture_y: item.texture_y };
    collisions[[true, false]] = { texture_x: item.texture_x + 2, texture_y: item.texture_y };
    collisions[[false, false]] = { texture_x: item.texture_x + 3, texture_y: item.texture_y };
  } else if (item.spread_type === 6) {
    // ?? No Collisions
    collisions = {};
  } else if (item.spread_type === 7) {
    // Collisions Upways/Downways
    collisions[[true, false]] = { texture_x: item.texture_x, texture_y: item.texture_y };
    collisions[[true, true]] = { texture_x: item.texture_x, texture_y: item.texture_y };
    collisions[[false, true]] = { texture_x: item.texture_x, texture_y: item.texture_y };
    collisions[[false, false]] = { texture_x: item.texture_x, texture_y: item.texture_y };
  } else if (item.spread_type === 9) {
    // Attaches on a single side bassed if theres a block
    // direction, can be - in either of - in the order of priority: down, up, left, right, default 0
    collisions[[true, false, false, false]] = { texture_x: item.texture_x + 1, texture_y: item.texture_y };
    collisions[[false, true, false, false]] = { texture_x: item.texture_x + 2, texture_y: item.texture_y };
    collisions[[false, false, true, false]] = { texture_x: item.texture_x + 3, texture_y: item.texture_y };
    collisions[[false, false, false, true]] = { texture_x: item.texture_x, texture_y: item.texture_y };
  } else if (item.spread_type === 10) {
    // ?? No collisions
  } else {
    collisions = {};
  }

  return collisions;
}
