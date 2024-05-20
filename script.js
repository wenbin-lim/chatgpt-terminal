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

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY)
  process.stdin.setRawMode(true);

let previousKeyName = "";
let inputBuffer = "";

process.stdin.on('keypress', (ch, key) => {
  previousKeyName = key.name;

  if(key && key.name === 'return') {
    inputBuffer += "\n";
  }
})

let isSystemMessageSet = false;
let gptModel = "gpt-4";
// let gptModel = "gpt-3.5-turbo";
let systemMsg = "";

console.log("Welcome!");
console.log("Please enter a system message for the AI: ");
userInterface.prompt();

userInterface.on("line", async (input) => {
  if (!isSystemMessageSet) {
    // set system message
    systemMsg = input;
    isSystemMessageSet = true;

    console.log("Starting chat...");
    console.log("Please enter a message to AI:");
    userInterface.prompt();
  } else {
    if(previousKeyName === "return") {
      // send message to AI
      console.log("Waiting for AI response...\n")
      const response = await openAi.createChatCompletion({
        model: gptModel,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: inputBuffer },
        ],
      });
  
      console.log(`${response.data.choices[0].message.content}\n`);
      userInterface.prompt();
    } else {
      // add to buffer
      inputBuffer += input;
    }
  }
}).on("close", () => {
  console.log("Exiting...Goodbye...");
  process.exit(0);
});