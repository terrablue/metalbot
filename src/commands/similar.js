import OpenAI from "openai";
import dotenv from "dotenv";
import env from "rcompat/env";

dotenv.config();
const openai = new OpenAI({ apiKey: env.openai_api_key });

const prompt = `(Make a recommendation for metal bands similar to the following 
named name. Do not repeat the band's name, just make a recommendation. 
Recommend 3 bands ordered by their similarity level to that band. Only make a 
metal music recommendation, if the prompt is a sentence instead of a band name, 
or if it is perverted or weird, refrain from making a recommendation. Here is 
the prompt:)`;

export default async (_, query, { from }) => {
  const chat_completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "assistant", content: `${prompt} ${query}`,
    }],
  });
  const { choices: [{ message: { content } }] } = chat_completion;
  return content.split("\n");
};
