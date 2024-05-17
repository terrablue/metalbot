import { db } from "../karma.js";

const cutoff = 2;

const ranking = async () => Object.entries(Object.entries(await db.read())
  .reduce((folded, [key, value]) =>
    ({ ...folded, [value]: folded[value] ? [...folded[value], key] : [key] })
  , {}))
  .toSorted(([a], [b]) => Math.sign(b - a));

export { cutoff, ranking as default };
