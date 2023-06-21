const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const yargs = require('yargs')
const port_option = require('./port_socket.json')
const fs = require('fs');
const { venomClient } = require('./venom_server')
const { wa_filter } = require('./wa_filter')
require('colors')

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

var mySocket;

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  mySocket = socket;
});

app.use(cors());

app.get("/kirim", async (req, res) => {

  try {
    const number = req.query.number
    const text = req.query.text
    if (!number || !text) return res.end("error")
    const chat = await (await venomClient).sendText(number + "@c.us", text)
    return res.json({
      status: "success",
      data: chat
    })
  } catch (error) {
    console.log(error)
    return res.json({
      status: "failed",
      data: `${error}`
    })
  }

})

app.get("/number-status", async (req, res) => {
  try {
    const number = req.query.number
    const status = await (await venomClient).checkNumberStatus(number + "@c.us")
    return res.json({
      number: number,
      data: status
    })
  } catch (error) {
    res.json({
      error: error
    })
  }
})

app.get("/get-contact", async (req, res) => {
  try {
    const number = req.query.number
    const contact = await (await venomClient).getContact(number + "@c.us")
    return res.json({
      number: number,
      data: contact
    })
  } catch (error) {
    return res.json({
      error: error
    })
  }
})

app.get("/number-profile", async (req, res) => {
  try {
    const data = await (await venomClient).getNumberProfile(req.query.number + "@c.us")
    return res.json({
      number: req.query.number,
      data: data
    })
  } catch (error) {
    return res.json({
      error: error
    })
  }
})

app.get("/is-connected", async (req, res) => {
  try {
    const data = await (await venomClient).isConnected()
    return res.json({
      isConnected: data
    })
  } catch (error) {
    return res.json({
      error: error
    })
  }
})

app.get("/is-login", async (req, res) => {
  try {
    const data = await (await venomClient).isLoggedIn()
    return res.json({
      isLoggedIn: data
    })
  } catch (error) {
    res.json({
      error: error
    })
  }
})


var sudahJalan = false;
app.get("/filter", async (req, res) => {

  if (io == null || io == undefined) return res.end("socket error")
  if (!sudahJalan) {
    wa_filter(venomClient, io)
    sudahJalan = true
    return res.json({
      success: true,
      data: "start"
    })
  }

  return res.json({
    success: true,
    data: "running"
  })
})

server.listen(port_option.port, () => {
  console.log(`listening on *:${port_option.port}`);
});

