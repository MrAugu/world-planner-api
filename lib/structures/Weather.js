class Weather {
  constructor (data) {
    this.id = String(data.id);
    this.name = data.name;
    this.file = data.file;
    this.hash = data.hash;
    this.contents = data.contents;
  }
}

module.exports = Weather;
