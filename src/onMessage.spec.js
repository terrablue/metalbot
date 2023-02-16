import onMessage from "./onMessage.js";

const to = "#to";

export default test => {
  test.case("types", assert => {
    assert(() => onMessage()).throws("`undefined` must be of type string");
    assert(() => onMessage("t")).throws("`undefined` must be of type string");
  });

  test.case("invalid message", assert => {
    const message = "?unknown params";
    assert(() => onMessage(to, message)).throws(`invalid message: ${message}`);
  });

  test.case("invalid command", assert => {
    const message = "!unknown params";
    assert(() => onMessage(to, message)).throws("invalid command: unknown");
  });

  test.case("valid command", async assert => {
    const message = "!band Jinjer";
    const result = await onMessage(to, message);
    result((_, line) => {
      assert(typeof line === "string").true();
    });
  });
};
