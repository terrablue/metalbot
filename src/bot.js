import {Path} from "runtime-compat/fs";
import irc from "irc-upd";
import {config} from "dotenv";
import onMessage from "./onMessage.js";

config();

const {network, user, channels, password} = process.env;
const users = new Path(import.meta.url).up(1).join("db", "users.json");

const client = new irc.Client(network, user, {
  channels: channels.split(";"),
  password,
});

const record = {
  users: await users.json() ?? {},
  create(nick) {
    if (this.users[nick] === undefined) {
      this.users[nick] = {};
    }
  },
  async save() {
    await users.file.write(JSON.stringify(this.users));
  },
  quit(nick) {
    this.create(nick);
    this.users[nick].quit = new Date();
    this.save();
  },
  join(nick) {
    this.create(nick);
    this.users[nick].join = new Date();
    this.save();
  },
  message(nick) {
    this.create(nick);
    this.users[nick].message = new Date();
    this.save();
  },
};

client.addListener("join", (_, nick) => {
  record.join(nick);
});

client.addListener("quit", nick => {
  record.quit(nick);
});


client.addListener("message", async (from, to, message) => {
  // only react if in channel
  if (!channels.includes(to)) {
    return;
  }

  record.message(from);

  try {
    (await onMessage(to, message))((...args) => client.say(...args));
  } catch (error) {
    //console.log(error);
  }
});
