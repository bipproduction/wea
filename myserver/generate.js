const fs = require('fs')
require("colors")
const pattern = /\.emit\("([^"]+)",/g;


const text1 = fs.readFileSync("./server_wa.js").toString()
const matches = text1.matchAll(pattern);

const text2 = fs.readFileSync("./server_socket.js").toString()
const matches2 = text2.matchAll(pattern);

const list1 = Array.from(matches, m => m[1])
const list2 = Array.from(matches2, m => m[1])

const listHasil = [...list1, ...list2].map((m) => `"${m}"`).join(" | ")

const newText = `
/**
 * @param {${listHasil}} path
 */
module.exports = function socketEmit(socket, path, data) {
    socket.emit(path, data);
}

/**
 * @param {${listHasil}} path
 */
module.exports = function socketOn(socket, path, onData) {
    socket.on(path, onData);
}
`

fs.writeFileSync("socket_fun.js", newText)
console.log("success".cyan)