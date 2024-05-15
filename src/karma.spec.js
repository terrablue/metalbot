import {default as karma, db} from "./karma.js";

const channel = "#metal";
const foo = {client: "weechat", from: "foo"};
const bar = {client: "weechat", from: "bar"};
const baz = {client: "weechat", from: "baz"};
const bletch = {client: "weechat", from: "bletch"};

export default test => {
    test.setup(async () => {
        console.log("removing karma.json");
        await db.remove();
    });

    test.case('agreement with someone else', async assert => {
        await karma('nutella is gross', channel, foo);
        assert(await karma('^', channel, bar)).equals(['foo has a karma level of 1']);
    })

    test.case('agreement with self', async assert => {
        await karma('nutella is gross', channel, foo);
        // you can't agree with yourself! I mean, you can, but not to get karma
        assert(await karma('^', channel, foo)).equals(undefined);
    })

    for (const nick of [
        'foobar',
        'foo bar',
        'foo_bar',
        'foo-bar',
        'f1o2o3-b4a5r6',
        '[foo]bar',
        'foo|bar',
        "you're a moron",
        'foo+bar'
    ]) {
        test.case("matches " + nick, async assert => {
            {
                assert(await karma(`${nick}++`, channel, foo)).equals([
                    `${nick} has a karma level of 1`,
                ]);
            }
        });
    }

    test.case("baz++ from baz (self-karma)", async assert => {
        const result_foo = await karma("baz++", channel, baz);
        assert(result_foo).equals([
            "You can't add to your own karma, baz.",
            "baz has a karma level of -1",
        ]);
    });

    test.case("bletch++ from foo", async assert => {
        const result_bar = await karma("bletch++", channel, foo);
        assert(result_bar).equals([
            "bletch has a karma level of 1",
        ]);
    });

    test.case("negative--", async assert => {
        const result_foo = await karma("negative--", channel, bar);
        assert(result_foo).equals(["negative has a karma level of -1"]);
        const result_foo2 = await karma("negative--", channel, bar);
        assert(result_foo2).equals(["negative has a karma level of -2"]);
    });
};
