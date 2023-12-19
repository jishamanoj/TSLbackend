
require('dotenv').config();
const { DataTypes, Sequelize } = require('sequelize');
//const bcrypt = require('bcrypt');
const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
    dialect: 'mysql',
    logging: false,
    
});
const timeTracking = sequelize.define('timeTracking',{
    userId: { type: DataTypes.INTEGER},
    med_starttime: { type: DataTypes.STRING},
    med_stoptime: { type: DataTypes.STRING},
   // med_endtime: { type: DataTypes.STRING},
    timeEstimate: { type: DataTypes.STRING},
});
sequelize.sync({alter:true})
    .then((data) => {
       // console.log(data);
        console.log('timeTracking table created');
    })
    .catch((err) => {
        console.log(err);
    });
module.exports = timeTracking