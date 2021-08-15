const { parseQueryInteger, codes, getItemIdentifier, getItemSprite } = require("../../../lib/index");

const routes = async (fastify) => {
  fastify.get("/media/textures/:hash", async (request, response) => {
    const texture = fastify.cache.textures.get(request.params.hash);
    if (!texture) return response.code(404).send(codes[404]);
    response.header("Content-Disposition", `inline;filename="${texture.name}"`);
    response.header("Content-Type", "image/png");
    response.code(200).send(texture.contents);
  });

  fastify.get("/media/textures/:hash/slice", async (request, response) => {
    const texture = fastify.cache.textures.get(request.params.hash);
    if (!texture) return response.code(404).send(codes[404]);
    
    const x = parseQueryInteger(request, "x", -1);
    const y = parseQueryInteger(request,"y", -1);

    if (x < 0 || y < 0) return response.code(400).send(codes[400]);
    if (!texture.slices || !texture.slices[x] || !texture.slices[x][y]) return response.code(404).send(codes[404]);

    const slice = texture.slices[x][y];
    if (request.query.format === "json") {
      response.header("Content-Type", "application/json");
      response.code(200).send({
        code: 200,
        error: null,
        message: "Success",
        data: slice.toString("base64")
      });
    } else {
      response.header("Content-Disposition", `inline;filename="${texture.name}"`);
      response.header("Content-Type", "image/png");
      response.code(200).send(slice);
    }
  });

  fastify.get("/media/textures/:hash/slices/bulk", async (request, response) => {
    const texture = fastify.cache.textures.get(request.params.hash);
    if (!texture) return response.code(404).send(codes[404]);
    if (!request.query.sprites) return response.code(400).send(codes[400]);
    
    let sprites;
    try {
      sprites = JSON.parse(request.query.sprites);
    } catch (err) {
      return response.code(400).send(codes[400]);
    }
    sprites = sprites.filter(obj => Array.isArray(obj));
    sprites = sprites.filter(arr => arr.length === 2 && !isNaN(arr[0]) && !isNaN(arr[1]));
    sprites = sprites.filter(sprite => texture.slices[sprite[0]][sprite[1]]);
    if (!sprites.length) response.code(400).send(codes[400]);
    sprites = sprites.map(sprite => ({
      sprite_x: sprite[0],
      sprite_y: sprite[1],
      data: texture.slices[sprite[0]][sprite[1]].toString("base64")
    }));
    
    response.header("Content-Type", "application/json");
    response.code(200).send({
      code: 200,
      error: null,
      message: "Success",
      data: sprites
    });
  });

  fastify.get("/media/sprites", async (request, response) => {
    const query = getItemIdentifier(fastify.cache.items, request);
    if (!query) return response.code(404).send(codes[404]);
    const sprite = getItemSprite(query.texture, query);
    if (!sprite) return response.code(404).send(codes[404]);
    response.header("Content-Disposition", `inline;filename="${query.texture.name}"`);
    response.header("Content-Type", "image/png");
    response.code(200).send(sprite);
  });
};

module.exports = routes;
