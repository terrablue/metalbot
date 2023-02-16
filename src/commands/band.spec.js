import band from "./band.js";

const get = query => band("!", query);

export default test => {
  test.case("remote: no results", async assert => {
    const result = await get("Blind Guardians");
    assert(result).equals(["no results"]);
  });

  test.case("remote: different cases", async assert => {
    await Promise.all(["Blind Guardian", "BLIND GUARDIAN", "bLIND gUARDIAN"]
      .map(async query => {
        const result = await get(query);
        assert(result).equals([
          "Blind Guardian [Germany, 1987]: Speed Metal (early); Power Metal (later)",
        ]);
      }));
  });

  test.case("remote: 1-20 results", async assert => {
    const result = await get("Crash Test");
    assert(result).equals([
      "Crash Test [Argentina, 1999]: Groove Metal",
      "Crash Test [Russia, 2004]: Heavy Metal/Hard Rock",
    ]);
  });

  test.case("local: no results", async assert => {
    const result = await get("Jinjer2");
    assert(result).equals(["no results"]);
  });

  test.case("local: different cases", async assert => {
    await Promise.all(["Jinjer", "jinjer", "JINJER"]
      .map(async query => {
        const result = await get(query);
        assert(result).equals([
          "Jinjer [Ukraine, 2008]: Metalcore; Progressive Metal",
        ]);
      }));
  });
};
