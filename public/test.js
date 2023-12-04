document.addEventListener("DOMContentLoaded", () => {
      const socket = io();

      document.getElementById("send-button").addEventListener("click", () => {
            const messageInput = document.getElementById("message-input");
            const message = messageInput.value;
            socket.emit('chat_message', message);
            appendMessage("my-message", message);
            messageInput.value = "";
      });

      socket.on('chat_message', (data) => {
            const message = `${data.username}: ${data.message}`;

            appendMessage("their-message", message);
      });

      function appendMessage(className, message) {
            const conversation = document.getElementById("conversation");
            const messageDiv = document.createElement("div");
            messageDiv.className = `message ${className}`;
            messageDiv.innerHTML = `${message} <span class="time">${getCurrentTime()}</span>`;
            conversation.appendChild(messageDiv);
      }

      function getCurrentTime() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
      }
});