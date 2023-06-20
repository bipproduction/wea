// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

const venomClient = venom
    .create({
        session: 'session-makuro' //name of session
    })
    .then((client) => client)

module.exports = { venomClient }