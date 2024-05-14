import karma from "./karma.js";
import {File}from "rcompat/fs";

//const run = async (...args) => (await _run(...args)).lines;
const channel = "#metal";
const foo = {client: "weechat", from: "foo"};
const bar = {client: "weechat", from: "bar"};

export default test => {
  test.setup(async () => {
    await File.remove("./karma.json");
  });

  test.case("++", async assert => {
    const result_foo = await karma("foo++", channel, foo);
    assert(result_foo).equals([
      "You can't add to your own karma, foo.",
      "foo has a karma level of -1",
    ]);
    const result_bar = await karma("bar++", channel, foo);
    assert(result_bar).equals([
      "bar has a karma level of 1",
    ]);
  });

  test.case("--", async assert => {
    await karma("foo++", channel, bar);
    const result_foo = await karma("foo--", channel, bar);
    assert(result_foo).equals(["foo has a karma level of -1"]);
    const result_foo2 = await karma("foo--", channel, bar);
    assert(result_foo2).equals(["foo has a karma level of -2"]);
  });

};
