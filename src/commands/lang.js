import {Path} from "runtime-compat/fs";

const languages = await new Path(import.meta.url).up(2)
  .join("db", "languages.json").file.json();
const user_langs_file = new Path(import.meta.url).up(2)
  .join("db", "users_languages.json").file;
const user_langs = await user_langs_file.json();
const set = "To a set a language, write !lang [language]";
const options = `Options are: ${ Object.keys(languages).join(" ")}`;
const follow = [set, options];

export default async (_, language, {from}) => {
  const $from = from.toLowerCase();

  if (language.trim() === "") {
    if (user_langs[$from] === undefined) {
      return ["you have no language set", ... follow];
    }
    return [`Your language is \x0300,01${user_langs[$from]}\x03`, ... follow];
  }
  const $language = language.trim().toLowerCase();
  if (languages[$language] !== undefined) {
    user_langs[from] = $language;
    await user_langs_file.write(JSON.stringify(user_langs));
    return [`setting language to ${language}`];
  }
  return ["language not found in list", options];

};

export {user_langs};
