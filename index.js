// index.js – główny serwer
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

// konfiguracja środowiska
dotenv.config();

const app = express();
const server = http.createServer(app);

// konfiguracja Socket.io do live update
const io = new Server(server, {
  cors: { origin: "*" } // możesz później ustawić front-end URL
});

// middleware
app.use(cors());
app.use(express.json());

// import modułów
const authRoutes = require('./auth');
const matchRoutes = require('./matches');
const betRoutes = require('./bets');
const adminRoutes = require('./admin');

// przypisanie endpointów
app.use('/api/auth', authRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/bets', betRoutes);
app.use('/api/admin', adminRoutes);

// podłączenie Socket.io do aplikacji
app.set('io', io);
io.on('connection', (socket) => {
  console.log('Nowe połączenie Socket.io:', socket.id);

  // możemy emitować np. live update rankingów i wyników
  socket.on('disconnect', () => {
    console.log('Użytkownik rozłączony:', socket.id);
  });
});

// start serwera
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
