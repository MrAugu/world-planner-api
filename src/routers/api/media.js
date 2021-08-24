const { parseQueryInteger, codes, getItemIdentifier, getItemSprite, paginate, getStringifedObject } = require("../../../lib/index");
const max_page_size = 3;
const min_page_size = 1;
const jwt = require("jsonwebtoken");
const SnowflakeId = require("snowflake-id").default;
const snowflake = new SnowflakeId({
  mid: 2,
  offset: (2021 - 1970) * 31536000 * 1000 
});
const { Request } = require("@modcord/http-client");

const routes = async (fastify) => {
  fastify.get("/media/textures/:hash", async (request, response) => {
    const texture = fastify.cache.textures.get(request.params.hash);
    if (!texture) return response.code(404).send(codes[404]);
    response.header("Content-Disposition", `inline;filename="${texture.name}"`);
    response.header("Content-Type", "image/png");
    response.code(200).send(texture.contents);
  });

  fastify.get("/media/textures/:hash/slices", async (request, response) => {
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

  fastify.get("/media/weathers/:hash", async (request, response) => {
    const weather = fastify.cache.weathers.get(request.params.hash);
    if (!weather) return response.code(404).send(codes[404]);
    response.header("Content-Disposition", `inline;filename="${weather.name}"`);
    response.header("Content-Type", "image/png");
    response.code(200).send(weather.contents);
  });

  fastify.get("/media/weathers", async (request, response) => {
    let auth;
    if (!request.headers.authorization) return response.code(403).send(codes[403]);
    else {
      const [keyword, authorization] = request.headers.authorization.split(" ");
      if (!keyword || keyword !== "Bearer") return response.code(403).send(codes[403]);
      if (!authorization) return response.code(403).send(codes[403]);
      try {
        const payload = jwt.verify(authorization, process.env.SECRET);
        if (!payload.id) return response.code(403).send(codes[403]);
        const [[token]] = await fastify.db.execute("SELECT * FROM `world_planner`.`tokens` WHERE (id = ?)", [ BigInt(payload.id) ]);
        if (!token) return response.code(403).send(codes[403]);
        auth = token;
      } catch (err) {
        return response.code(403).send(codes[403]);
      }
    }

    const requestId = snowflake.generate();
    fastify.db.execute("INSERT INTO `world_planner`.`requests` (id, token_id, headers, date, ip, url, query_string) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      BigInt(requestId),
      auth.id,
      JSON.stringify(request.headers),
      new Date(),
      request.headers.http_cf_connecting_ip || request.ip || null,
      request.url,
      JSON.stringify(request.query)
    ]);

    if (auth.isTrustworthy) {
      const webhookRequest = new Request(process.env.LOG_WEBHOOK)
        .method("post")
        .body({
          username: "World Planner Logger",
          content: `OK: Trustworthy token \`[${auth.id}]\` made the request with id \`[${requestId}]\` and query string:\n\`\`\`${getStringifedObject(request.query)}\`\`\``
        });
      webhookRequest.send();
    } else {
      const webhookRequest = new Request(process.env.SECURITY_WEBHOOK)
        .method("post")
        .body({
          username: "World Planner Logger",
          content: `NOT OK!: **__Un-trustworthy token__** \`[${auth.id}]\` made the request with id \`[${requestId}]\` and query string:\n\`\`\`${getStringifedObject(request.query)}\`\`\`\nCC: <@367302593753645057> & <@235660286718246912>`
        });
      webhookRequest.send();
    }

    response.header("Content-Type", "application/json");
    const totalCount = fastify.cache.weathers.size; 
    const page_number = parseQueryInteger(request, "page", 1);
    const page_size = parseQueryInteger(request, "page_size", 2);

    if (page_size < min_page_size || page_size > max_page_size) return response.code(400).send(codes[400]);
    if (page_number > (totalCount / page_size) + 1) return response.code(400).send(codes[400]);
    const weathers = paginate(Array.from(fastify.cache.weathers.values()), page_size, page_number);

    return response.code(200).send({
      total_count: totalCount,
      maximum_size: max_page_size,
      amount_returned: weathers.length,
      weathers: weathers.map(weather => ({
        name: weather.name,
        hash: weather.hash,
        data: weather.contents.toString("base64")
      }))
    }); 
  });
};

module.exports = routes;
