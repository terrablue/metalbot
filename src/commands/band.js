import {Path, File} from "runtime-compat/filesystem";

const db_file = new Path(import.meta.url).directory.join("../db/bands.json");
const bands_db = JSON.parse(await File.read(db_file));

const base = new Path("https://www.metal-archives.com/search");
const uris = {
  bands: query => base.join(`ajax-advanced/searching/bands/?exactBandMatch=1&bandName=${encodeURI(query)}`),
};

const re = /<.*>(?<name>.*)<\/a>/gu;
const maxTries = 10;

const remote = {
  bands: async (query, tries = 0) => {
    if (tries > maxTries) {
      console.log("too many retries, exiting");
      return [];
    }
    try {
      const {aaData: results} = await (await fetch(uris.bands(query))).json();
      return results.map(([info, genres, country, year]) => ({
        name: [...info.matchAll(re)][0].groups.name, genres, country, year,
     }));
    } catch (error) {
      console.log("fetch error, retrying");
      console.log(error);
      // retry
      return remote.bands(query, tries + 1);
    }
  },
};

const local = {
  bands: query => bands_db.filter(({name}) =>
    name.toLowerCase() === query.toLowerCase()),
};

const search = {
  bands: async query => {
    const results = local.bands(query);
    return results.length === 0
      ? remote.bands(query)
      : results.map(result => ({...result, genres: result.genres.join("; ")}));
  },
};

const maxRecords = 20;

export default async (prefix, query) => {
  const results = await search.bands(query);

  const totals = results.length;

  // no results
  if (totals === 0) {
    return ["no results"];
  }

  // too many results
  if (totals > maxRecords) {
    return ["too many results, refine your query"];
  }

  // 1-20 results
  return results.map(({name, genres, country, year}) =>
    `${name} [${country}, ${year}]: ${genres}`);
};
