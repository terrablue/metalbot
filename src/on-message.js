import {is} from "runtime-compat/dyndef";
import * as commands from "./commands/exports.js";
import youtube from "./youtube.js";

const command_re = /^(?<prefix>[!+])(?<name>.*?) (?<params>.*)/gu;
const command_names = Object.keys(commands);
const eq = right => left => left === right;

export default async (to, message, more) => {
  is(to).string();
  is(message).string();

  const yt = await youtube(message);
  if (yt) {
    return say => say(to, yt);
  }

  if (["hello", "hi", "hullo", "hola"].includes(message.toLowerCase().trim())) {
    return say => say(to, `Hi ${more.from}!`);
  }

  if (["bye", "goodbye", "adiós"].includes(message.toLowerCase().trim())) {
    return say => say(to, `Shalom ${more.from}!`);
  }

  if (message.includes("metalbot")) {
    return say => say(to, `Olá ${more.from}! ¿Cómo estás?`);
  }

  const match = [...message.trim().matchAll(command_re)]?.[0]?.groups;

  // invalid message
  if (match === undefined) {
    throw new Error(`invalid message: ${message}`);
  }

  const {prefix, name, params} = match;

  // invalid command
  if (!command_names.some(eq(name))) {
    throw new Error(`invalid command: ${name}`);
  }

  const result = await commands[name](prefix, params, {to, ...more});
  return say => result.forEach(line => say(to, line));
};
