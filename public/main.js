let socket;
let username;
let usersOnline = [];
window.onload = function () {
      socket = io();
      socket.on('connect', handeleConnectionSuccessCallback);
      function handeleConnectionSuccessCallback() {
            console.log(`Connection successfully with id ${socket.id}`);
            username = sessionStorage.getItem('username');
            if (username) {
                  console.log('Username is read from session storage');
            }
            if (!username) {
                  username = prompt(' Enter your username');
                  sessionStorage.setItem('username', username);
            }
            socket.emit('register-name', username);
      }
      socket.on('disconnect', function () {
            console.log(' disconnected to server');
      })
      // socket.on('error', function () {
      //       console.log(' Error ' + err.message);
      // })
      // socket.on('message', message => {
      //       console.log(`RECEIVED A MESSAGE FROM SERVER :  ${message}`);
      //       socket.send(message.toUpperCase());

      // });
      socket.on('list_users', (users) => {
            console.log('RECEIVED a list users online from server');
            users.forEach(user => {
                  console.log(user)
                  if (user.id !== socket.id) {
                        usersOnline.push(user);
                  }
            }
            )
      })
      socket.on('new_users', (user) => {
            console.log(`A new user connected.  Except to you, total users exist : ${usersOnline.length + 1}`);
            console.log(user);
            usersOnline.push(user);
      });
      socket.on('user_leave', (id) => {
            usersOnline = usersOnline.filter(user => user.id != id);
            user = usersOnline.find(user => user.id != id);
            console.log(`User had ${id} is left,Except to you, just ${usersOnline.length} users in room  `);
            removeUser(id)
            notificationOff(user.username)
      });
      socket.on('register-name', ({ id, username }) => {
            console.log(`Received register-name event. ID: ${id}, Username: ${username}`);
            let user = usersOnline.find(u => u.id == id);
            if (!user) {
                  return console.log('User is not found ');
            }
            user.username = username
            console.log(`User id: ${id} got register name  : ${user.username}`);
            displayUser(user);
            notificationOnl(user.username)

      })
      $('#online-notification').fadeTo(10, 0)
      $('#offline-notification').fadeTo(10, 0)

      document.getElementById("send-button").addEventListener("click", () => {
            const messageInput = document.getElementById("message-input");
            const message = messageInput.value;
            const imageInput = document.getElementById("image-input");
            const imageFile = imageInput.files[0];
            if (imageFile) {
                  const formData = new FormData();
                  formData.append('message', message);
                  formData.append('image', imageFile);
                  const url = window.location.origin;
                  fetch(`${url}/upload`, {
                        method: 'POST',
                        body: formData
                  })
                        .then(response => response.json())
                        .then(data => {
                             
                                    appendMessage("my-message", message, data.image);
                              
                        })
                        .catch(error => {
                              console.error('Error sending image to server:', error);
                        });
                  messageInput.value = "";
                  imageInput.value = "";
            } else {
                  socket.emit('chat_message', { message: message });
                  appendMessage("my-message", message);
                  messageInput.value = "";
            }
      });
      socket.on('chat_message', (data) => {
            const message = `${data.username}: ${data.message}`;
            appendMessage("their-message", message);
      });
};

function appendMessage(className, message, image) {
      const conversation = document.getElementById("conversation");
      
      const messageDiv = document.createElement("div");
      messageDiv.className = `message ${className}`;

      if (image) {
            const imageElement = document.createElement("img");
            imageElement.src = image;
            messageDiv.appendChild(imageElement);
      } else {
            messageDiv.innerHTML = `${message} <span class="time">${getCurrentTime()}</span>`;
      }

      conversation.appendChild(messageDiv);
}

function getCurrentTime() {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
}

function displayUser(user) {
      let status;
      if (user.free === true) {
            status = '<div class="badge badge-success badge-pill">Đang rảnh </div>'
      } else {
            status = '<div class="badge badge-warning badge-pill">Đang bận </div>'
      }

      let userDiv = $(`<div id="${user.id}" class="user">
      <div class="avatar">C</div>
      <div class="user-info">
        <div class="user-name">${user.username}</div>
        <div class="online">Truy cập lúc: ${user.loginAt}'</div>
      </div>
      <div class="status">
        ${status}
      </div>
    </div>`)
      $('#user-list').append(userDiv)
      $('#online-count').html($('#user-list .user').length)
}

function removeUser(id) {
      $(`#${id}`).remove();
      $('#online-count').html($('#user-list .user').length)
}
function notificationOnl(username) {
      $('#online-notification strong').html(username)
      $('#online-notification').fadeTo(1000, 1)
      setTimeout(() => {
            $('#online-notification').fadeTo(1000, 0)
      }, 3000);



}
function notificationOff(username) {
      $('#offline-notification strong').html(username)
      $('#offline-notification').fadeTo(1000, 1)
      setTimeout(() => {
            $('#offline-notification').fadeTo(1000, 0)
      }, 3000);

}

