import { file } from "rcompat/fs";
import { keymap } from "rcompat/object";

export default async (_, nick) => {
  const users = await file(import.meta.url).up(2).join("db", "users.json")
    .json();
  const trimmed = nick.trim();
  const lcusers = keymap(users, name => name.toLowerCase());
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
