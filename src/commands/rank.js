import { db } from "../karma.js";

const cutoff = 2;

export default async _ => {
  const ranking = Object.entries(Object.entries(await db.read())
    .reduce((folded, [key, value]) =>
      ({ ...folded, [value]: folded[value] ? [...folded[value], key] : [key] })
    , {}))
    .toSorted(([a], [b]) => Math.sign(b - a));
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
