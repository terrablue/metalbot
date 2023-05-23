import {Path} from "runtime-compat/fs";

export default async (_, nick) => {
  const users = await new Path(import.meta.url).up(2).join("db", "users.json")
    .json();
  if (users[nick.toLowerCase()] !== undefined) {
    const user = users[nick.toLowerCase()];
    const join = user.join ?? "unknown";
    const message = user.message ?? "unknown";
    const quit = user.quit ?? "unknown";
    return [
      `join: ${join}, message: ${message}, quit: ${quit} (all times UTC)`,
    ];
  }

  return [`nick ${nick} never seen`];
};
