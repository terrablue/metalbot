import { db } from "../karma.js";

export default async (_, other, { from: you }) => {
  const me = other.length === 0;
  const nick = me ? you : other;
  const address = me ? "Your" : `${nick}'s`;
  return [`${address} karma level is ${(await db.read())[nick.trim()] ?? 0}`];
};
