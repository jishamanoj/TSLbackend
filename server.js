const Sequelize = require('sequelize');
const app = require('./index');
const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
    dialect: 'mysql'
});

sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
