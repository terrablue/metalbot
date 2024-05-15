import FS from "rcompat/fs";
import { tryreturn } from "rcompat/async";

const db = {
  path: "db",
  datafile: "karma.json",
  get file() {
    return FS.File.join(this.path, this.datafile);
  },
  async read() {
    const { file } = this;
    return tryreturn(async () => await file.exists() ? file.json() : {})
      .orelse(_ => ({}));
  },
  async write(data = {}) {
    await this.file.write(JSON.stringify(data, null, 2));
  },
};

function karmaCheck(input) {
  // Regular expression to match valid karma change with optional trailing colon
  const karmaRegex = /^([a-zA-Z0-9\s]+):?\s*(\+\+|--)\s*$/;

  // Match the input string against the regex
  const match = input.match(karmaRegex);

  // If there's no match, return null indicating an invalid karma change
  if (!match) {
    return null;
  }

  // Extract subject and change from the match groups
  const frame = match[1].trim();
  const pattern = match[2];

  // Return the subject and change as an object
  return { frame, pattern };
}

export default async (message, channel, more) => {
  const { client, from } = more || {};
  const karma = karmaCheck(message);
  if (karma !== null) {
    const karmaDb = await db.read();
    let karmaValue = karmaDb[karma.frame] || 0;
    const responses = [];
    if(karma.frame === from && karma.pattern === "++") {
      // you can't inc your own karma, person.
      karma.pattern = "--";
      responses.push(`You can't add to your own karma, ${from}.`);
    }
    switch (karma.pattern) {
    case "--":
      karmaValue--;
      karmaDb[karma.frame] = karmaValue;
      await db.write(karmaDb);
      responses.push(`${karma.frame} has a karma level of ${karmaValue}`);
      return responses;
    case "++":
      karmaValue++;
      karmaDb[karma.frame] = karmaValue;
      await db.write(karmaDb);
      responses.push(`${karma.frame} has a karma level of ${karmaValue}`);
      return responses;
    default:
      break; // what?
    }
  }
  return undefined;
};
