import { default as ranking, cutoff } from "./ranking.js";

export default async _ => {
  const top = ranking.slice(0, cutoff);
  const bottom = ranking.slice(-cutoff);
  const midlurkers = ranking.length - cutoff * cutoff;

  return [
    ...top.map(([key, value], i) => `#${i + 1}: ${value.join(", ")} (${key})`),
    `... ${midlurkers > 0 ? midlurkers : 0} midlurkers`,
    ...bottom.map(([key, value], i, a) =>
      `#${ranking.length - a.length + i + 1}: ${value.join(", ")} (${key})`),
  ];
};
