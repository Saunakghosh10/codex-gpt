# AI Chat Assistant

AI Chat Assistant is a web application that allows users to interact with an AI-powered chatbot. The application uses the Llama 2 model via Replicate API for generating responses.

## Features

- Real-time chat interface
- AI-powered responses using Llama 2 model
- Server-side streaming for smooth conversation flow
- Responsive design

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (comes with Node.js)
- A Replicate API key

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ai-chat-assistant.git
   cd ai-chat-assistant
   ```

2. Install server dependencies:
   ```
   cd server
   npm install
   ```

3. Install client dependencies:
   ```
   cd ../client
   npm install
   ```

4. Create a `.env` file in the `server` directory and add your Replicate API key:
   ```
   REPLICATE_API_TOKEN=your_api_key_here
   ```

## Usage

1. Start the server:
   ```
   cd server
   npm run server
   ```

2. In a new terminal, start the client:
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

4. Start chatting with the AI assistant!

## Project Structure

- `client/`: Frontend code (HTML, CSS, JavaScript)
- `server/`: Backend code (Node.js, Express)
- `server/server.js`: Main server file
- `client/script.js`: Main client-side JavaScript file
- `client/index.html`: Main HTML file
- `client/style.css`: CSS styles

## Contributing

Contributions to the AI Chat Assistant project are welcome. Please feel free to submit a Pull Request.

## License

This project is licensed under the ISC License.

## Acknowledgements

- [Replicate](https://replicate.com/) for providing the AI model API
- [Express.js](https://expressjs.com/) for the server framework
- [Vite](https://vitejs.dev/) for the frontend build tool
