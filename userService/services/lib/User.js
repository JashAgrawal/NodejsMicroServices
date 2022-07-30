const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);

class SpeakersService {
  constructor(datafile, log) {
    this.log = log;
    this.datafile = datafile;
  }

  async getNames() {
    const data = await this.getData();

    return data.map((speaker) => ({
      name: speaker.name,
      shortname: speaker.shortname,
    }));
  }
  async getData() {
    const data = await readFile(this.datafile, "utf8");

    if (!data) return [];
    return JSON.parse(data).speakers;
  }
}

module.exports = SpeakersService;
