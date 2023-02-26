import irc from "irc-upd";
import {config} from "dotenv";
import onMessage from "./onMessage.js";

config();

const {network, user, channels, password} = process.env;

const client = new irc.Client(network, user, {
  channels: channels.split(";"),
  password,
});

client.addListener("message", async (from, to, message) => {
  // only react if in channel
  if (!channels.includes(to)) {
    return;
  }

  try {
    (await onMessage(to, message))((...args) => client.say(...args));
  } catch (error) {
    //console.log(error);
  }
});
