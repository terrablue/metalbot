import FS from "rcompat/fs";
import O from "rcompat/object";

export default async (_, nick) => {
  const users = await new FS.File(import.meta.url).up(2).join("db", "users.json")
    .json();
  const trimmed = nick.trim();
  const lcusers = O.keymap(users, name => name.toLowerCase());
  const user = users[trimmed] ?? lcusers[trimmed];
  if (user !== undefined) {
    const join = user.join ?? "unknown";
    const message = user.message ?? "unknown";
    const quit = user.quit ?? "unknown";
    return [
      `join: ${join}, message: ${message}, quit: ${quit} (all times UTC)`,
    ];
  }

  return [`nick ${nick} never seen`];
};
