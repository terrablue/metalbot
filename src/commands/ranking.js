import { db } from "../karma.js";

const cutoff = 2;

const ranking = async () => Object.entries(Object.entries(await db.read())
  .map(([key, value]) => [`${key.slice(0, -1)}\u200d${key.at(-1)}`, value])
  .reduce((folded, [key, value]) =>
    ({ ...folded, [value]: folded[value] ? [...folded[value], key] : [key] })
  , {}))
  .toSorted(([a], [b]) => Math.sign(b - a));

export { cutoff, ranking as default };
