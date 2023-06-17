import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';

// port
const PORT = 3000 || process.env.PORT;

// Inisialisasi aplikasi Express.js
const app = express();

// Aktifkan CORS
app.use(cors());

// Jalankan server HTTP pada port 3000
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Inisialisasi server Socket.IO
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

// Event saat ada koneksi baru
io.on('connection', (socket) => {
    console.log('New client connected');

    // Event saat menerima pesan baru dari client
    socket.on('message', (data) => {
        console.log(`Message received: ${data}`);

        // Kirim pesan ke semua client yang terhubung ke server
        io.emit('message', data);
    });

    // Event saat koneksi terputus
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
