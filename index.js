const express = require('express');
require('dotenv').config();
const routes = require('./routers/route');
const socketio = require('socket.io');
const path = require('path');
const app = express();
const session = require('express-session')
app.set('trust proxy', 1) // trust first proxy
app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }
}))
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
const db = require('./config/db/index');
db.connect();
routes(app)

// Dang nhap với google nằm trong homerouter 

const ChatHistory = require('./models/ChatHistory');
const PORT = process.env.PORT || 3000;
const httpServer = app.listen(PORT, () => console.log('http://localhost:' + PORT));
const io = socketio(httpServer);


app.use('/uploads', express.static('uploads'));


const multer = require('multer');
const storage = multer.diskStorage({
      destination: function (req, file, cb) {
            cb(null, './uploads/');
      },
      filename: function (req, file, cb) {
            cb(null, file.originalname);
      }
});
const upload = multer({
      storage: storage,
      limits: {
            fileSize: 1024 * 1024 * 5
      },

});

app.post('/upload', upload.single('image'), (req, res) => {
      const message = req.body.message;
      const imageFile = req.file;
      if (imageFile) {
            res.json({ message, image: imageFile.originalname });
      } else {
            res.json({ message });
      }
});




io.on('connection', client => {
      console.log(`Client has ${client.id} connected`);
      client.free = true;
      client.loginAt = new Date().toLocaleDateString();

      const users = Array.from(io.sockets.sockets.values()).map(sk => ({ id: sk.id, username: sk.username, free: sk.free, loginAt: sk.loginAt }))
      client.on('disconnect', () => {
            console.log(`\t\t Client has ${client.id} left`)
            client.broadcast.emit('user_leave', client.id)
      });
      client.on('register-name', username => {
            client.username = username;
            client.broadcast.emit('register-name', { id: client.id, username: username });
      })
      // client.send('Hello this is a message send from server')

      client.emit('list_users', users)
      client.broadcast.emit('new_users', { id: client.id, username: client.username, free: client.free, loginAt: client.loginAt })



      client.on('chat_message', (message) => {
            const data = {
                  username: client.username,
                  message: message.message, // Access the 'message' property
            };

            const chatHistory = new ChatHistory({
                  text: message.message, // Access the 'message' property
            });

            chatHistory
                  .save()
                  .then(() => {
                        console.log('Added text successfully');
                  })
                  .catch((err) => {
                        console.log('Error:', err);
                  });

            client.broadcast.emit('chat_message', data);
      });


})