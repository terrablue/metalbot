import { default as ranking, cutoff } from "./ranking.js";

export default async _ => {
  const midlurkers = ranking.slice(cutoff, -cutoff)
    .map(([karma, users]) => `${users.join(", ")} (${karma})`).join(", ");
  return [midlurkers];
};
