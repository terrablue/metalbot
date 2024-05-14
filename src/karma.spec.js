import karma from "./karma.js";

const channel="#metal"

/* Not a real test. */
console.log(await karma('foo++', channel, {client:'weechat', from:'foo'}));
console.log(await karma('foo++', channel, {client:'weechat', from:'bar'}));

