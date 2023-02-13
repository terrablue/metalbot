import {Path} from "runtime-compat/filesystem";

const base = new Path("https://www.metal-archives.com/search");
const uris = {
  bands: query => base.join(`ajax-band-search/?query=${encodeURI(query)}`),
};

const re = /<.*>(?<name>.*)<\/a>/gu;

export default {
  band: async query => {
    const results = await (await fetch(uris.bands(query.toLowerCase()))).json();
    const {iTotalRecords, aaData} = results;

    // no results
    if (iTotalRecords === 0) {
      return ["no results"];
    }

    // too many results
    if (iTotalRecords > 5) {
      return ["too many results, refine your query"];
    }

    // 1-5 results
    return aaData
      .map(([info, genre, country]) => ({
        name: [...info.matchAll(re)][0].groups.name, genre, country,
      }))
      .map(({name, genre, country}) => `${name} [${country}]: ${genre}`);
  },
};
