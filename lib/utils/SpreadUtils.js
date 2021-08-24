function getSpread (item) {
  let spread = {};
  if (item.spread_type === 2) {
    // All ways with 47
    spread[[true, true, true, true]] = {
      texture_x: item.texture_x,
      texture_y: item.texture_y
    };
    spread[[false, true, true, true]] = {
      texture_x: item.texture_x + 1,
      texture_y: item.texture_y
    };
    spread[[true, false, false, true]] = {
      texture_x: item.texture_x,
      texture_y: item.texture_y + 1
    };
    spread[[true, true, false, true]] = {
      texture_x: item.texture_x + 2,
      texture_y: item.texture_y
    };
    spread[[true, false, true, false]] = {
      texture_x: item.texture_x + 1,
      texture_y: item.texture_y + 1
    };
    spread[[false, false, true, false]] = {
      texture_x: item.texture_x + 2,
      texture_y: item.texture_y + 1
    };
    spread[[true, true, true, false]] = {
      texture_x: item.texture_x + 3,
      texture_y: item.texture_y
    };
    spread[[true, false, false, false]] = {
      texture_x: item.texture_x + 3,
      texture_y: item.texture_y + 1
    };
    spread[[true, false, true, true]] = {
      texture_x: item.texture_x + 4,
      texture_y: item.texture_y
    };
    spread[[false, false, false, false]] = {
      texture_x: item.texture_x + 4,
      texture_y: item.texture_y + 1
    };
    spread[[false, true, true, false]] = {
      texture_x: item.texture_x + 5,
      texture_y: item.texture_y
    };
    spread[[false, false, true, true]] = {
      texture_x: item.texture_x + 6,
      texture_y: item.texture_y
    };
    spread[[true, true, false, false]] = {
      texture_x: item.texture_x + 7,
      texture_y: item.texture_y
    };
    spread[[false, true, false, false]] = {
      texture_x: item.texture_x + 5,
      texture_y: item.texture_y + 3
    };
    spread[[false, false, false, true]] = {
      texture_x: item.texture_x + 6,
      texture_y: item.texture_y + 3
    };
    spread[[false, true, false, true]] = {
      texture_x: item.texture_x + 4,
      texture_y: item.texture_y + 3
    };
  } else if (item.spread_type === 5) {
    // All ways, but has only 16
    spread[[true, true, true, true]] = {
      texture_x: item.texture_x,
      texture_y: item.texture_y
    };
    spread[[false, true, true, true]] = {
      texture_x: item.texture_x + 1,
      texture_y: item.texture_y
    };
    spread[[true, false, false, true]] = {
      texture_x: item.texture_x,
      texture_y: item.texture_y + 1
    };
    spread[[true, true, false, true]] = {
      texture_x: item.texture_x + 2,
      texture_y: item.texture_y
    };
    spread[[true, false, true, false]] = {
      texture_x: item.texture_x + 1,
      texture_y: item.texture_y + 1
    };
    spread[[false, false, true, false]] = {
      texture_x: item.texture_x + 2,
      texture_y: item.texture_y + 1
    };
    spread[[true, true, true, false]] = {
      texture_x: item.texture_x + 3,
      texture_y: item.texture_y
    };
    spread[[true, false, false, false]] = {
      texture_x: item.texture_x + 3,
      texture_y: item.texture_y + 1
    };
    spread[[true, false, true, true]] = {
      texture_x: item.texture_x + 4,
      texture_y: item.texture_y
    };
    spread[[false, false, false, false]] = {
      texture_x: item.texture_x + 4,
      texture_y: item.texture_y + 1
    };
    spread[[false, true, true, false]] = {
      texture_x: item.texture_x + 5,
      texture_y: item.texture_y
    };
    spread[[false, false, true, true]] = {
      texture_x: item.texture_x + 6,
      texture_y: item.texture_y
    };
    spread[[true, true, false, false]] = {
      texture_x: item.texture_x + 7,
      texture_y: item.texture_y
    };
    spread[[false, true, false, false]] = {
      texture_x: item.texture_x + 6,
      texture_y: item.texture_y + 1
    };
    spread[[false, false, false, true]] = {
      texture_x: item.texture_x + 5,
      texture_y: item.texture_y + 1
    };
    spread[[false, true, false, true]] = {
      texture_x: item.texture_x + 7,
      texture_y: item.texture_y + 1
    };
  } else if (item.spread_type === 1) {
    // No spread
    spread = {};
  } else if (item.spread_type === 4) {
    // Attaches on a single side bassed if theres a block in that or none
    // direction, can be - in either of - in the order of priority: down, up, left, right or none
    spread[[true, false, false, false]] = {
      texture_x: item.texture_x + 1,
      texture_y: item.texture_y
    };
    spread[[false, true, false, false]] = {
      texture_x: item.texture_x + 2,
      texture_y: item.texture_y
    };
    spread[[false, false, true, false]] = {
      texture_x: item.texture_x + 3,
      texture_y: item.texture_y
    };
    spread[[false, false, false, true]] = {
      texture_x: item.texture_x,
      texture_y: item.texture_y
    };
    spread[[false, false, false, false]] = {
      texture_x: item.texture_x + 4,
      texture_y: item.texture_y
    };
  } else if (item.spread_type === 3 || item.spread_type === 8) {
    // spread Leftways/Rightways
    spread[[false, true]] = {
      texture_x: item.texture_x,
      texture_y: item.texture_y
    };
    spread[[true, true]] = {
      texture_x: item.texture_x + 1,
      texture_y: item.texture_y
    };
    spread[[true, false]] = {
      texture_x: item.texture_x + 2,
      texture_y: item.texture_y
    };
    spread[[false, false]] = {
      texture_x: item.texture_x + 3,
      texture_y: item.texture_y
    };
  } else if (item.spread_type === 6) {
    // ?? No spread
    spread = {};
  } else if (item.spread_type === 7) {
    // spread Upways/Downways
    spread[[true, false]] = {
      texture_x: item.texture_x,
      texture_y: item.texture_y
    };
    spread[[true, true]] = {
      texture_x: item.texture_x + 1,
      texture_y: item.texture_y
    };
    spread[[false, true]] = {
      texture_x: item.texture_x + 2,
      texture_y: item.texture_y
    };
    spread[[false, false]] = {
      texture_x: item.texture_x + 3,
      texture_y: item.texture_y
    };
  } else if (item.spread_type === 9) {
    // Attaches on a single side bassed if theres a block
    // direction, can be - in either of - in the order of priority: down, up, left, right, default 0
    spread[[true, false, false, false]] = {
      texture_x: item.texture_x + 1,
      texture_y: item.texture_y
    };
    spread[[false, true, false, false]] = {
      texture_x: item.texture_x + 2,
      texture_y: item.texture_y
    };
    spread[[false, false, true, false]] = {
      texture_x: item.texture_x + 3,
      texture_y: item.texture_y
    };
    spread[[false, false, false, true]] = {
      texture_x: item.texture_x,
      texture_y: item.texture_y
    };
  } else if (item.spread_type === 10) {
    // ?? No spread
    spread = {};
  } else {
    spread = {};
  }
  
  return spread;
}

module.exports = { getSpread };
