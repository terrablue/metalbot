import on_message from "./on-message.js";

const to = "#to";

export default test => {
  test.case("types", assert => {
    assert(() => on_message()).throws("`undefined` must be of type string");
    assert(() => on_message("t")).throws("`undefined` must be of type string");
  });

  test.case("invalid message", assert => {
    const message = "?unknown params";
    assert(() => on_message(to, message)).throws(`invalid message: ${message}`);
  });

  test.case("invalid command", assert => {
    const message = "!unknown params";
    assert(() => on_message(to, message)).throws("invalid command: unknown");
  });

  test.case("valid command", async assert => {
    const message = "!band Jinjer";
    const result = await on_message(to, message);
    result((_, line) => {
      assert(typeof line === "string").true();
    });
  });
};
