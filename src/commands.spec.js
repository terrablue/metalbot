import commands from "./commands.js";

export default test => {
  test.case("no results", async assert => {
    const result = await commands.band("Blind Guardians");
    assert(result).equals(["no results"]);
  });

  test.case("1-5 results", async assert => {
    const result = await commands.band("Crash Test");
    assert(result).equals([
      "Crash Test [Argentina]: Groove Metal",
      "Crash Test [Russia]: Heavy Metal/Hard Rock",
    ]);
  });

  test.case("too many results", async assert => {
    const result = await commands.band("Blind");
    assert(result).equals(["too many results, refine your query"]);
  });
};
