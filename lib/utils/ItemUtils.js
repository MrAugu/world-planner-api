const { getSpread } = require("./SpreadUtils");

function getItemSpriteArray (item) {
  const spreads = getSpread(item);
  for (const spread of Object.keys(spreads)) {
    spreads[spread] = Object.assign(spreads[spread], { data: item.texture.slices[spreads[spread].texture_x][spreads[spread].texture_y].toString("base64") });
  }
  return spreads;
}

function getItemIdentifier (items, request) {
  const name = request.query.name;
  const id = request.query.id;
  if (!name && !id) return;
    
  if (name) {
    const searchedItem = items.find(item => item.name.toLowerCase() === name.toLowerCase());
    if (searchedItem) return searchedItem;
  }
  
  if (id) {
    let idBuffer, itemId;
    try {
      idBuffer = Buffer.from(id, "hex");
      itemId = idBuffer.readInt32BE(2);
      const searchedItem = items.get(itemId);
      if (searchedItem) return searchedItem;
    } catch (err) {
      return;
    }
  }
}
  
function getItemSprite (texture, item) {
  if (item.spread_type === 1) return texture.slices[item.texture_x][item.texture_y];
  else if ([2,3].includes(item.spread_type)) return texture.slices[item.texture_x + 4][item.texture_y + 1];
  else if ([3, 7, 9].includes(item.spread_type)) return texture.slices[item.texture_x + 3][item.texture_y];
  else if (item.spread_type === 4) return texture.slices[item.texture_x + 4][item.texture_y];
  else if (item.spread_type === 6) return texture.slices[item.texture_x][item.texture_y];
  else if (item.spread_type === 10) return texture.slices[item.texture_x][item.texture_y];
  throw new Error("Unknown spread type. " + item.spread_type);
}
  

module.exports = {
  getItemSpriteArray,
  getItemIdentifier,
  getItemSprite
};
