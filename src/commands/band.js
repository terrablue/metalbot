import {Path} from "runtime-compat/fs";

const db = new Path(import.meta.url).up(2).join("db", "bands.json");
const bands = await db.json();

const base = new Path("https://www.metal-archives.com/search");
const uris = {
  bands: query => base.join(`ajax-advanced/searching/bands/?exactBandMatch=1&bandName=${query}`),
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
      const {aaData: results} = await (await fetch(uris.bands(encodeURIComponent(query)))).json();
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
  bands: query => bands.filter(({name}) =>
    name.toLowerCase() === query.toLowerCase()),
};

const search = {
  bands: async query => {
    const results = local.bands(query);
    return results.length === 0
      ? remote.bands(query)
      : results.map(result => ({...result,
        genres: result.genres?.map(g => g.trim()).join("; ") ?? "",
        source: "local",
      }));
  },
};

const maxRecords = 20;

const instruction = `+band name=<name>, year=<year>, country=<country>, genres=<genre1>;<genre2>`;

const commands = {
  "!": async query => {
    const results = await search.bands(query);

    const totals = results.length;

    // no results
    if (totals === 0) {
      return [`no results | add with ${instruction}`];
    }

    // too many results
    if (totals > maxRecords) {
      return ["too many results, refine your query"];
    }

    // 1-20 results
    return results.map(({name, genres, country, year, source}) =>
      `${name} [${country}, ${year}]: ${genres} [${source ?? "MA"}]`);
  },
  "+": async update => {
    const allowedKeys = ["name", "country", "year", "genres"];
    const operations = update.split(",").map(o => o.trim().split("="));

    const invalidKey = operations.find(([key]) => !allowedKeys.includes(key));
    if (invalidKey !== undefined) {
      return [`invalid key: ${invalidKey[0]}`];
    }

    const {name, country, year, genres} = Object.fromEntries(operations);

    if (name === undefined) {
      return ["must specify name (name=<band name>)"];
    }

    const band = local.bands(name)?.[0] ?? {name, insert: true};

    if (country !== undefined) {
      band.country = country;
    }
    if (year !== undefined) {
      if (!/^\d{4}$/u.test(year)) {
        return ["year must be in the format YYYY"];
      }
      band.year = Number(year);
    }
    if (genres !== undefined) {
      const genreArray = genres.split(";")
      if (genreArray.some(genre => !/^[a-zA-Z- ()]+$/u.test(genre))) {
        return ["genres must be in the format `Genre 1 (; Genre 2)`"];
      }
      band.genres = genres.split(";");
    }

    if (band.insert) {
      const {insert: _, ...newBand} = band;
      bands.push(newBand);
    }

    await db.file.write(JSON.stringify(bands));

    return ["database updated"];
  },
};

export default (prefix, query) =>
  commands[prefix]?.(query) ?? [`prefix "${prefix}" not supported`];
