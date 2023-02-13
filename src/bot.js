import irc from "irc-upd";
import {config} from "dotenv";
import commands from "./commands.js";

config();

const {network, user, channels, password} = process.env;

const client = new irc.Client(network, user, {
  channels: channels.split(";"),
  password,
});

const commandNames = Object.keys(commands);

const eq = right => left => left === right;

const onMessage = async (from, to, message) => {
  // message must start with !
  if (!message.startsWith("!")) {
    return;
  }

  const [command] = message.slice(1).split(" ");
  // must be a valid command
  if (!commandNames.some(eq(command))) {
    return;
  }

  // only react if in channel
  if (!channels.includes(to)) {
    return;
  }

  (await commands[command](message)).forEach(line => client.say(to, line));
};

client.addListener("message", onMessage);
