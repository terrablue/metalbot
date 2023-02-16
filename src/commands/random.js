const url = "https://www.metal-archives.com/band/random";
const nameRE = /<title>(?<name>.*) -/gu;
const countryRE = /lists\/.*">(?<country>.*)<\/a>/gu;
const yearRE = /Formed in:<\/dt>\n<dd>(?<year>.*)<\/dd>/gu;
const genresRE = /Genre:<\/dt>\n<dd>(?<genres>.*)<\/dd>/gu;

export default async () => {
  const results = await (await fetch(url)).text();
  const {name} = [...results.matchAll(nameRE)][0].groups;
  const {country} = [...results.matchAll(countryRE)][0].groups;
  const {year} = [...results.matchAll(yearRE)][0].groups;
  const {genres} = [...results.matchAll(genresRE)][0].groups;
  return [`${name} [${country}, ${year}]: ${genres}`];
};
