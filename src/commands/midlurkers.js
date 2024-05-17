import { default as rankingfn, cutoff } from "./ranking.js";

export default async _ => {
  const ranking = await rankingfn();
  const midlurkers = ranking.slice(cutoff, -cutoff)
    .map(([karma, users]) => `${users.join(", ")} (${karma})`).join(", ");
  return [midlurkers];
};
