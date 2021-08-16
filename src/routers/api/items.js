const { paginate, parseQueryInteger, codes, getItemSpriteArray, getItemSprite, getStringifedObject } = require("../../../lib/index");
const max_page_size = 150;
const min_page_size = 1;
const jwt = require("jsonwebtoken");
const SnowflakeId = require("snowflake-id").default;
const snowflake = new SnowflakeId({
  mid: 2,
  offset: (2021 - 1970) * 31536000 * 1000 
});
const { Request } = require("@modcord/http-client");

const routes = async (fastify) => {
  fastify.get("/items", async (request, response) => {
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
    const totalCount = fastify.cache.items.size; 
    const page_number = parseQueryInteger(request, "page_number", 1);
    const page_size = parseQueryInteger(request, "page_size", 5);

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
