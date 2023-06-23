import {Path} from "runtime-compat/fs";
import {transform} from "runtime-compat/object";
import env from "runtime-compat/env";

const limit = Number(env.limit);

const getNames = (client, channel) => {
  let resolve;
  client.once("names", (_, names) => resolve(Object.keys(names)));
  client.send("names", channel);
  return new Promise(r => {
    resolve = r;
  });
};

const bot = env.user;

export default async (_, _2, {to, from, client}) => {
  const users = await new Path(import.meta.url).up(2).join("db", "users.json")
    .json();
  const present = await getNames(client, to);
  const senders = [bot, from];
  const names = transform(users, entry => entry
    // exclude users not in channel and the bot
    .filter(([name]) => present.includes(name) && !senders.includes(name))
    // exclude users who have never spoken
    .filter(([, data]) => data.message !== undefined)
    // map key to names, value to dates
    .map(([user, data]) => [
      present.find(p => p === user),
      new Date(data.message).getTime(),
    ])
    .toSorted(([, a], [, b]) => Math.sign(b - a))
    .filter((_, i) => i < limit));

  return [`^ ${Object.keys(names).join(", ")}`];
};
