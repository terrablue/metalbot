import { db } from "../karma.js";

export default async (_, _2, { from: nick }) =>
  [`Your karma level is ${(await db.read())[nick.trim()] ?? 0}`];
