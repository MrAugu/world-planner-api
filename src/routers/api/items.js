const { paginate, parseQueryInteger, codes } = require("../../../lib/index");

const routes = async (fastify) => {
  fastify.get("/items", async (request, response) => {
    const totalCount = fastify.cache.items.size;
    const page_number = parseQueryInteger(request, "page_number", 1);
    const page_size = parseQueryInteger(request, "page_size", 5);

    if (page_size < 1 || page_size > 100) return response.code(400).send(codes[400]);
    if (page_number > (totalCount / page_size) + 1) return response.code(400).send(codes[400]);

    const items = paginate(Array.from(fastify.cache.items.values()), page_size, page_number);

    return response.code(200).send({
      total_count: totalCount,
      returned: items.length,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        texture: item.texture.hash,
        action_type: item.action_type,
        texture_x: item.texture_x,
        texture_y: item.texture_y,
        collision_type: item.collision_type
      }))
    }); 
  });
};

module.exports = routes;
