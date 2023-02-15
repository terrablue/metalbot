import {Path} from "runtime-compat/filesystem";
import also_metal from "./also-metal.json" assert {type: "json"};

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
      return null;
    }
    try {
      return await (await fetch(uris.bands(query))).json();
    } catch (error) {
      console.log("fetch error, retrying");
      console.log(error);
      // retry
      return api.bands(query, tries + 1);
    }
  },
};

const local = {
  bands: query => {
    const aaData = also_metal.filter(({name}) => name === query).map(
      ({name, country, year, genre}) =>
      [`<a href="">${name}</a>`, genre.join("; "), country, year]
    );
    return {iTotalRecords: aaData.length, aaData};
  }
};

const search = {
  bands: async query => {
    const results = (await remote.bands(query));
    return results?.iTotalRecords === 0 ? local.bands(query): results;
  }
};

export default {
  band: async query => {
    const results = await search.bands(query);

    const {iTotalRecords, aaData} = results;

    // no results
    if (iTotalRecords === 0) {
      return ["no results"];
    }

    // too many results
    if (iTotalRecords > 10) {
      return ["too many results, refine your query"];
    }

    // 1-10 results
    return aaData
      .map(([info, genre, country, year]) => ({
        name: [...info.matchAll(re)][0].groups.name, genre, country, year
      }))
      .map(({name, genre, country, year}) =>
        `${name} [${country}, ${year}]: ${genre}`);
  },
};
