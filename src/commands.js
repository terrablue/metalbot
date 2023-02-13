import {Path} from "runtime-compat/filesystem";

const base = new Path("https://www.metal-archives.com/search");
const uris = {
  bands: query => base.join(`ajax-advanced/searching/bands/?exactBandMatch=1&bandName=${encodeURI(query)}`),
};

const re = /<.*>(?<name>.*)<\/a>/gu;

export default {
  band: async query => {
    let results;
    try {
      results = await (await fetch(uris.bands(query))).json();
    } catch (error) {
      console.log(error);
      return ["error accessing api"];
    }
    const {iTotalRecords, aaData} = results;

    // no results
    if (iTotalRecords === 0) {
      return ["no results"];
    }

    // too many results
    if (iTotalRecords > 10) {
      return ["too many results, refine your query"];
    }

    // 1-5 results
    return aaData
      .map(([info, genre, country, year]) => ({
        name: [...info.matchAll(re)][0].groups.name, genre, country, year
      }))
      .map(({name, genre, country, year}) =>
        `${name} [${country}, ${year}]: ${genre}`);
  },
};
