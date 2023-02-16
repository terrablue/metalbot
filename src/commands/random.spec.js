import random from "./random.js";

export default test => {
  test.case("correct format", async assert => {
    const band = await random();
    assert(/.*\[.*,.*\]:.*/u.test(band)).true();
  });
};
