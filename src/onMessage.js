import {is} from "runtime-compat/dyndef";
import * as commands from "./commands/exports.js";
import youtube from "./youtube.js";

const commandRE = /^(?<prefix>[!+])(?<name>.*?) (?<params>.*)/gu;
const commandNames = Object.keys(commands);
const eq = right => left => left === right;

export default async (to, message, more) => {
  is(to).string();
  is(message).string();

  const yt = await youtube(message);
  if (yt) {
    return say => say(to, yt);
  }

  const match = [...message.trim().matchAll(commandRE)]?.[0]?.groups;

  // invalid message
  if (match === undefined) {
    throw new Error(`invalid message: ${message}`);
  }

  const {prefix, name, params} = match;

  // invalid command
  if (!commandNames.some(eq(name))) {
    throw new Error(`invalid command: ${name}`);
  }

  const result = await commands[name](prefix, params, {to, ...more});
  return say => result.forEach(line => say(to, line));
};
