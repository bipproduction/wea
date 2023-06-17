
/**
 * @param {"checkNumber" | "isRegistered" | "urutan" | "apa"} path
 */
module.exports = function socketEmit(socket, path, data) {
    socket.emit(path, data);
}

/**
 * @param {"checkNumber" | "isRegistered" | "urutan" | "apa"} path
 */
module.exports = function socketOn(socket, path, onData) {
    socket.on(path, onData);
}
