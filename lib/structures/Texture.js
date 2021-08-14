const sizeOf = require("buffer-image-size");
const imageToSlices = require("image-to-slices");

function sliceImage (buffer, lineXArray, lineYArray) {
  return new Promise((resolve) => {
    imageToSlices(`data:image/png;base64,${buffer.toString("base64")}`, lineXArray, lineYArray, {
      saveToDataUrl: true,
      clipperOptions: {
        canvas: require("node-canvas")
      }
    }, (dataUrl) => resolve(dataUrl));
  });
}

class Texture {
  constructor (data) {
    this.id = String(data.id);
    this.name = data.name;
    this.hash = data.hash;
    this.contents = data.contents;
    this.setDimensions();
  }

  setDimensions () {
    const { width, height } = sizeOf(this.contents);
    this.width = width;
    this.height = height;
  }

  async createSlices () {
    this.slices = [];
    for (let i = 0; i < this.width / 32; i++) this.slices.push([]);

    const lineXArray = [];
    const lineYArray = [];

    let xCummulator = 1;
    for (let i = 1; i <= this.width / 32; i++) {
      xCummulator = i * 32;
      lineYArray.push(xCummulator);
    }

    let yCummulator = 1;
    for (let i = 1; i <= this.height / 32; i++) {
      yCummulator = i * 32;
      lineXArray.push(yCummulator);
    }

    const slices = await sliceImage(this.contents, lineXArray, lineYArray);
    for (const slice of slices) this.slices[slice.x / 32][slice.y / 32] = Buffer.from(slice.dataURI.split(",")[1], "base64");
  }
}

module.exports = Texture;
