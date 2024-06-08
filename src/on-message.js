import { is } from "rcompat/invariant";
import FS from "rcompat/fs";
import * as commands from "./commands/exports.js";
import youtube from "./youtube.js";
import karma from "./karma.js";
import { user_langs } from "./commands/lang.js";

const command_re = /^(?<prefix>[!+])(?<name>[^ ]*) ?(?<params>.*)/gu;
const command_names = Object.keys(commands);
const eq = right => left => left === right;

const languages = await new FS.File(import.meta.url).up(1)
  .join("db", "languages.json").json();

const his = [
  "hello",
  "hi",
  "hola",
  "hullo",
  "yo",
  "אהלן",
  "היי",
  "יו",
  "שלום",
];

const byes = [
  "bye",
  "goodbye",
  "adiós",
  "ביי",
];

export default async (to, message, more) => {
  is(to).string();
  is(message).string();

  const yt = await youtube(message);
  if (yt) {
    return say => say(to, yt);
  }

  const karma_result = await karma(message, to, more);
  if(karma_result) {
    return say => karma_result.forEach(line => say(to, line));
  }

  if (his.includes(message.toLowerCase().trim())) {
    const language = languages.hi[user_langs[more.from] ?? "en"];
    return say => say(to, `${language} ${more.from}!`);
  }

  if (byes.includes(message.toLowerCase().trim())) {
    const language = languages.bye[user_langs[more.from] ?? "en"];
    return say => say(to, `${language} ${more.from}!`);
  }

  const lowercase = message.toLowerCase();
  if (lowercase.includes("metalbot") && lowercase.includes("love")) {
    return say => say(to, "<3");
  }

  if (message.split(" ").some(word => word.toLowerCase() === "metalbot")) {
    return say => say(to, `Olá ${more.from}! ¿Cómo estás?`);
  }

  const match = [...message.trim().matchAll(command_re)]?.[0]?.groups;

  // invalid message
  if (match === undefined) {
    throw new Error(`invalid message: ${message}`);
  }

  const { prefix, name, params } = match;

  // invalid command
  if (!command_names.some(eq(name))) {
    throw new Error(`invalid command: ${name}`);
  }

  const result = await commands[name](prefix, params, { to, ...more });
  return say => result.forEach(line => say(to, line));
};
