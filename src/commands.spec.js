import commands from "./commands.js";

export default test => {
  test.case("no results", async assert => {
    const result = await commands.band("Blind Guardians");
    assert(result).equals(["no results"]);
  });

  test.case("different cases", async assert => {
    await Promise.all(["Blind Guardian", "BLIND GUARDIAN", "bLIND gUARDIAN"]
      .map(async query => {
        const result = await commands.band(query);
        assert(result).equals([
          "Blind Guardian [Germany, 1987]: Speed Metal (early); Power Metal (later)",
        ]);
      }));
  });

  test.case("1-10 results", async assert => {
    const result = await commands.band("Crash Test");
    assert(result).equals([
      "Crash Test [Argentina, 1999]: Groove Metal",
      "Crash Test [Russia, 2004]: Heavy Metal/Hard Rock",
    ]);
  });
};
