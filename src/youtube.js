const getId = message => {
  const regexp =
    /((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu\.be))(\/(?:[\w\-]+\?v=|embed|shorts\/|v\/)?)(?<id>([\w\-]+)(\S+)?)/g;
  return regexp.exec(message)?.groups?.id;
};

const base = "https://www.googleapis.com/youtube/v3/videos";

const getURL = id =>
  `${base}?part=id%2C+snippet&id=${id}&key=${process.env.YOUTUBE}`;

export default async (message, channel, c) => {
  const id = getId(message.split("?")[0]);
  if (id) {
    const [idWithoutTime] = id.split("?t=");

    return await fetch(getURL(idWithoutTime), {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(r => r.json())
      .then(res => {
        const title = res.items[0]?.snippet?.title;
        if (title) {
          return `YouTube Title: ${title}`;
        }
        return undefined;
      });
  }
  return undefined;
};
