// index.js

import summarizeText from "./aiService.js";

const main = async () => {
  const textToSummarize = "Your text to summarize goes here.";
  try {
    const summary = await summarizeText(null, textToSummarize);
    console.log("Summary:", summary);
  } catch (error) {
    console.error("Error:", error);
  }
};

main();
