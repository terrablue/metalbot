import band from "./band.js";

const get = query => band("!", query);
const set = query => band("+", query);

export default test => {
  test.case("unsupported prefix", assert => {
    assert(band("-", "param")).equals(["prefix \"-\" not supported"]);
  });

  test.case("get remote: no results", async assert => {
    const result = await get("Blind Guardians");
    assert(result).equals(["no results"]);
  });

  test.case("get remote: different cases", async assert => {
    await Promise.all(["Blind Guardian", "BLIND GUARDIAN", "bLIND gUARDIAN"]
      .map(async query => {
        const result = await get(query);
        assert(result).equals([
          "Blind Guardian [Germany, 1987]: Speed Metal (early); Power Metal (later)",
        ]);
      }));
  });

  test.case("special characters", async assert => {
    const result = await get("Demons & Wizards");
    assert(result).equals([
      "Demons & Wizards [United States, 1997]: Power Metal",
    ]);
  });

  test.case("get remote: 1-20 results", async assert => {
    const result = await get("Crash Test");
    assert(result).equals([
      "Crash Test [Argentina, 1999]: Groove Metal",
      "Crash Test [Russia, 2004]: Heavy Metal/Hard Rock",
    ]);
  });

  test.case("get local: no results", async assert => {
    const result = await get("Jinjer2");
    assert(result).equals(["no results"]);
  });

  test.case("get local: different cases", async assert => {
    await Promise.all(["Jinjer", "jinjer", "JINJER"]
      .map(async query => {
        const result = await get(query);
        assert(result).equals([
          "Jinjer [Ukraine, 2008]: Metalcore; Progressive Metal",
        ]);
      }));
  });

  test.case("set local: errors", async assert => {
    assert(await set("name2=test band")).equals(["invalid key: name2"]);
    const nameError = ["must specify name (name=<band name>)"];
    assert(await set("country=US")).equals(nameError);
    const yearError = ["year must be in the format YYYY"];
    assert(await set("name=jinjer, year=10000")).equals(yearError);
    const genresError = ["genres must be in the format `Genre 1 (; Genre 2)`"];
    assert(await set("name=jinjer, genres=Metal + Rock")).equals(genresError);
  });

  test.case("set local: valid", async assert => {
    assert(await set("name=Test Band, country=Japan, year=2000, genres=Punk"))
      .equals(["database updated"]);
  });
};
