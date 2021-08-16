const snowflakeId = require("snowflake-id").default;
const snowflake = new snowflakeId({
  mid: 1,
  offset: (2021 - 1970) * 31536000 * 1000 
});
const jwt = require("jsonwebtoken");
const { codes } = require("../../../lib/index");

const routes = async (fastify) => {
  fastify.put("/sessions/new", async (request, response) => {
    response.header("Content-Type", "application/json");
    const headers = JSON.stringify(request.headers);
    const body = JSON.stringify(request.body ? request.body : null);
    let identifier = request.body ? request.body.test : null;
    const stamp = request.body ? request.body.stamp : null;
    let isTruthworthy;

    // const str = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0".split("").map(x => x.charCodeAt(0)).reverse().map(c 
    // => c + 55).map(z => String.fromCharCode(z)).map(x => Buffer.from(x).toString("hex")).join(":");

    if (identifier && typeof identifier === "string" && stamp && !isNaN(parseInt(stamp))) {
      if (Date.now() - stamp > 120000) return response.code(400).send(codes[400]);
      const offset = getDateOffset(parseInt(stamp));
      identifier = identifier
        .split(":")
        .map(charBytes => Buffer.from(charBytes, "hex"))
        .map(binString => binString.toString())
        .map(char => char.charCodeAt(0))
        .map(charCode => charCode - (13 + offset))
        .reverse()
        .map(charCode => String.fromCharCode(charCode))
        .join("");
      
      if (identifier === request.headers["user-agent"]) isTruthworthy = true;
      else isTruthworthy = false;
    } else {
      isTruthworthy = false;
    }

    const tokenPayload = {
      issued: new Date(),
      id: snowflake.generate()
    };

    const token = jwt.sign(tokenPayload, process.env.SECRET);
    await fastify.db.execute("INSERT INTO `world_planner`.`tokens` (id, token, headers, body, issued, isTrustworthy) VALUES (?, ?, ?, ?, ?, ?)", [
      BigInt(tokenPayload.id),
      token,
      headers,
      body,
      tokenPayload.issued,
      isTruthworthy
    ]);

    response.code(200).send(Object.assign(tokenPayload, { authorization: token }));
  });
};

module.exports = routes;

function getDateOffset (date) {
  return Math.trunc(
    String(
      date - Math.trunc(date / 10 ** 12) * 10 ** 12
    )
      .split("")
      .map(digit => Number(digit))
      .map(digit => Math.trunc(digit * Math.PI))
      .reduce((accumulator, index) => accumulator + index) / Math.PI
  );
}

// const f = (x) => Math.trunc(String(x - Math.trunc(x / 10**12) * 10**12).split("").map(x => Number(x)).map(x => Math.trunc(x * Math.PI)).reduce((a, i) => a + i) / Math.PI)

// "PostmanRuntime/7.28.3".split("").map(x => x.charCodeAt(0)).reverse().map(c => c + f(Date.now()) + 13).map(z => String.fromCharCode(z)).map(x => 
// Buffer.from(x).toString("hex")).join(":") + "  " + Date.now()