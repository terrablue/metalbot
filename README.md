# Metal music bot

This is an IRC bot that takes queries and shows data from Metal Archives, the
de-facto master source on everything heavy metal related.

Join `#metal` on `irc.libera.chat` to use it.

## Data queries

Data is queried live, there is no caching at the moment.

`!band <query>` - shows data about a band using an exact query match

`!random` - shows data about a random band

## Requirements

You'll need an OpenAI key. Copy `.env.default` to `.env` and set the `OPENAI_API_KEY` value to your OpenAI key.

## Testing

Testing in metalbot takes place in the running directory, so if you're doing a development-only build,
there are some things you'll need to do.

```shell
echo "[]" > src/db/bands.json
echo "[]" > src/db/users_languages.json
```

To test, run:

```shell
npm test
```
