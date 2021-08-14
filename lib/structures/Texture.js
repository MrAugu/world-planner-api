class Texture {
  constructor (data) {
    this.id = String(data.id);
    this.name = data.name;
    this.hash = data.hash;
    this.contents = data.contents;
  }
}

module.exports = Texture;
