import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
    <div class="flex ${isAi ? 'justify-start' : 'justify-end'} mb-4">
      <div class="${isAi ? 'bg-ai-msg' : 'bg-user-msg'} rounded-lg p-3 max-w-[70%] shadow-md ${isAi ? 'text-gray-800' : 'text-gray-900'}">
        <p class="text-sm" id=${uniqueId}>${value}</p>
      </div>
    </div>
  `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const prompt = data.get("prompt").trim();

  if (!prompt) return;

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, prompt);
  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const messageDiv = document.getElementById(uniqueId);
  loader(messageDiv);

  try {
    // Updated server URL
    const response = await fetch("https://codex-gpt-gj0p.onrender.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = "";

    if (response.ok) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const eventData = line.slice(6).trim();
            if (eventData === '[DONE]') {
              break;
            } else {
              try {
                const jsonData = JSON.parse(eventData);
                if (jsonData.text) {
                  messageDiv.innerHTML += jsonData.text;
                }
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            }
          }
        }
      }
    } else {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      messageDiv.innerHTML = `Error: ${errorText}`;
    }
  } catch (error) {
    clearInterval(loadInterval);
    console.error('Fetch error:', error);
    messageDiv.innerHTML = `Error: ${error.message}`;
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    handleSubmit(e);
  }
});

// Add textarea auto-resize
const textarea = document.querySelector('textarea');
textarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = (this.scrollHeight) + 'px';
});

// Add this code instead
const observer = new MutationObserver(() => {
  chatContainer.scrollTop = chatContainer.scrollHeight;
});
observer.observe(chatContainer, { childList: true });
