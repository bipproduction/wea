const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const waServer = require('./server_wa');
const yargs = require('yargs')
const port_option = require('./port_socket.json')
const fs = require('fs');

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 [options]')
  .option('port', {
    alias: 'p',
    describe: 'use port',
    type: 'string',
    // demandOption: true,
  })
  .option('dev', {
    alias: 'd',
    describe: 'is dev',
    type: 'boolean',
    demandOption: true,
  })
  .help('h')
  .alias('h', 'help')
  .argv

if (argv.port) {
  port_option.port = argv.port
  console.log("saved port".green, argv.port)
  fs.writeFileSync('port_socket.json', JSON.stringify(port_option))
}

if (argv.dev === true) {
  port_option.dev = true
  console.log("saved dev".green, "true")
  fs.writeFileSync('port_socket.json', JSON.stringify(port_option))
} else {
  port_option.dev = false
  console.log("saved dev".green, "false")
  fs.writeFileSync('port_socket.json', JSON.stringify(port_option))
}

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

server.listen(port_option.port, () => {
  console.log(`listening on *:${port_option.port}`);
});

waServer.start(io);