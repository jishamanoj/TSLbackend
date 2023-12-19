require('dotenv').config();
const { DataTypes, Sequelize } = require('sequelize');
//const bcrypt = require('bcrypt');
const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
    dialect: 'mysql',
    logging: false,
    
});
const message = sequelize.define('message',{
    userId: { type: DataTypes.INTEGER},
    message: { type: DataTypes.TEXT},
    messageTime: { type: DataTypes.STRING}

});
sequelize.sync({alter:true})
    .then((data) => {
       // console.log(data);
        console.log('message table created');
    })
    .catch((err) => {
        console.log(err);
    });
    module.exports =message