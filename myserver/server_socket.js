const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const waServer = require('./server_wa');
const PORT = process.env.PORT || 3006;


const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(cors());

app.get("/apa", (req, res) => {
  io.emit("apa", "ini apa")
  res.end();
})

server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});

waServer.start(io);