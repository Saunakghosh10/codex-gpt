import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import Replicate from "replicate";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from AI Chat Assistant!'
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Received prompt:', prompt);

    const input = {
      prompt: prompt,
      system_prompt: "You are a helpful assistant",
      max_new_tokens: 500,
      temperature: 0.7,
      top_p: 0.95,
      repetition_penalty: 1,
      seed: 42,
    };

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const prediction = await replicate.predictions.create({
      version: "2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1",
      input: input,
    });

    let result = await replicate.predictions.get(prediction.id);

    while (result.status !== 'succeeded' && result.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      result = await replicate.predictions.get(prediction.id);
    }

    if (result.status === 'succeeded') {
      const output = result.output.join(''); // Join the array elements into a single string
      res.write(`data: ${JSON.stringify({ text: output })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ text: "Error: Model prediction failed" })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Port 5000 is busy, trying 5001...');
    app.listen(5001, () => {
      console.log('Server is running on port 5001');
    });
  } else {
    console.error(e);
  }
});
