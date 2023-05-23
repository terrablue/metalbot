import {Path} from "runtime-compat/fs";
const users = await new Path(import.meta.url).up(2).join("db", "users.json")
  .json();

export default (_, nick) => {
  if (users[nick] !== undefined) {
    const user = users[nick];
    const join = user.join ?? "unknown";
    const message = user.message ?? "unknown";
    const quit = user.quit ?? "unknown";
    return [
      `join: ${join}, message: ${message}, quit: ${quit} (all times UTC)`,
    ];
  }

  return [`nick ${nick} never seen`];
};
