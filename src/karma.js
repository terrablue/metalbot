import path from 'path';
import fs from "fs";
const dbpath="src/db";
const datafile = "karma.json";

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
  let frame = match[1].trim();
  const pattern = match[2];

  // Return the subject and change as an object
  return { frame, pattern };
}

function readDb() {
  try {
    if (fs.existsSync(path.join(dbpath,datafile))) {
      const data = fs.readFileSync(path.join(dbpath,datafile), "utf8");
      return JSON.parse(data);
    }
    return {};

  } catch (error) {
    return {};
  }
}

function writeDb(data) {
  fs.writeFileSync(path.join(dbpath,datafile), JSON.stringify(data || {}, null, 2));
}

export default async (message, channel, more) => {
  const {client, from} = more || {};
  const karma = karmaCheck(message);
  if (karma !== null) {
    const karmaDb = readDb();
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
      writeDb(karmaDb);
      responses.push(`${karma.frame} has a karma level of ${karmaValue}`);
      return responses;
    case "++":
      karmaValue++;
      karmaDb[karma.frame] = karmaValue;
      writeDb(karmaDb);
      responses.push(`${karma.frame} has a karma level of ${karmaValue}`);
      return responses;
    default:
      break; // what?
    }
  }
  return undefined;
};
