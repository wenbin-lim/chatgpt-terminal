import { config } from "dotenv";
config();

import { Configuration, OpenAIApi } from "openai";
import readline from "readline";

// setup
const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let isSystemMessageSet = false;
let gptModel = "gpt-3.5-turbo";
let systemMsg = "";

console.log("Please enter a system message");
userInterface.prompt();

userInterface.on("line", async (input) => {
  if (!isSystemMessageSet) {
    // set system message
    systemMsg = input;
    isSystemMessageSet = true;

    console.log("Starting chat...");
    console.log("Please enter a message to AI");
  } else {
    const response = await openAi.createChatCompletion({
      model: gptModel,
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: input },
      ],
    });

    console.log(response.data.choices[0].message.content);
    userInterface.prompt();
  }
});
