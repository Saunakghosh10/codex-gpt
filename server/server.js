import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003", // Choose a model suitable for your use case
      prompt: `${prompt}`,
      temperature: 0.6, // Adjust the temperature according to your needs
      max_tokens: 3000, // Adjust the number of max tokens according to your needs
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6, // Adjust the presence penalty according to your needs
    });

    const botResponse = response.data.choices[0]?.text?.trim();

    if (botResponse) {
      res.status(200).json({
        bot: botResponse,
      });
    } else {
      throw new Error("No response from the AI model.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || "Something went wrong");
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`AI server started on http://localhost:${port}`)
);
