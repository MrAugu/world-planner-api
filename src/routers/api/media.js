const { parseQueryInteger, codes } = require("../../../lib/index");

const routes = async (fastify) => {
  fastify.get("/media/textures/:hash", async (request, response) => {
    const texture = fastify.cache.textures.get(request.params.hash);
    if (!texture) return response.code(404).send(codes[404]);
    response.header("Content-Disposition", `inline;filename="${texture.name}"`);
    response.header("Content-Type", "image/png");
    response.code(200).send(texture.contents);
  });

  fastify.get("/media/textures/slice/:hash", async (request, response) => {
    const texture = fastify.cache.textures.get(request.params.hash);
    if (!texture) return response.code(404).send(codes[404]);
    response.header("Content-Disposition", `inline;filename="${texture.name}"`);
    response.header("Content-Type", "image/png");
    // response.code(200).send(texture.contents);
  });
};

module.exports = routes;
