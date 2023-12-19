require('dotenv').config();
const http = require('http');
const {Server} = require('socket.io')
const Sequelize = require('sequelize');
const { QueryTypes } = require('sequelize');

const app = require('./index');
const sequelize = new Sequelize("sequel", "root", "E@asybiz_d@_t@b@se_1234567", {
  dialect: "mysql",


});

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
      origin: '*', // Adjust this to allow specific origins
      methods: ['GET', 'POST'] // Define the methods you wish to allow
    }
  });

  io.on('connection', (socket) => {
    console.log('Connection established');
  
    socket.on('fetchusers', () => {
      sequelize.query("SELECT COUNT(id) AS count FROM regs", { type: QueryTypes.SELECT })
        .then((results) => {
          socket.emit('usersupdate', { results });
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          socket.emit('error', 'Failed to fetch users');
        });
   })
  
  })

console.log('qwerty')
sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

    server.listen(3000, () => {
    console.log('Listening on port 3000');
});