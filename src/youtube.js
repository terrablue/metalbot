import env from "runtime-compat/env";

const getId = message => {
  const regexp =
    /(?:(?:https?:)?\/\/)?(?:(?:www|m)\.)?(?:(?:youtube\.com|youtu.be))(?:\/(?:[\w-]+\?v=|embed\/|shorts\/|live\/|v\/)?)(?<id>[\w-]+)/gu;
  return regexp.exec(message)?.groups?.id;
};

const base = "https://www.googleapis.com/youtube/v3/videos";

const getURL = id => `${base}?part=id%2C+snippet&id=${id}&key=${env.YOUTUBE}`;

export default async (message, channel, c) => {
  const id = getId(message.split("?list=")[0]);
  if (id) {
    const [idWithoutTime] = id.split("?t=");

    return fetch(getURL(idWithoutTime), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(r => r.json())
      .then(res => {
        const [item] = res.items;
        if (item) {
          const {title, channelTitle} = item.snippet;
          return `\x0304,01►\x03 \x0314,01YouTube\x03 :: ${title} | ${channelTitle}`;
        }
        return undefined;
      });
  }
  return undefined;
};
