const { DataTypes, Sequelize } = require('sequelize');
//const bcrypt = require('bcrypt');
const sequelize = new Sequelize("sequel", "root", "E@asybiz_d@_t@b@se_1234567", {
    dialect: "mysql",
        logging: false,

});

const meditation = sequelize.define('meditation',{
    userId: { type: DataTypes.INTEGER},
    session_num: { type: DataTypes.STRING,defaultValue:0},
    day : { type: DataTypes.INTEGER,defaultValue:0  },
    cycle : { type: DataTypes.INTEGER,defaultValue: 0   },
    med_starttime : { type: DataTypes.STRING},
    med_stoptime : { type: DataTypes.STRING},
    med_endtime : { type: DataTypes.STRING},

   // message : { type: DataTypes.TEXT}
});

sequelize.sync({alter:true})
    .then((data) => {
       // console.log(data);
        console.log('meditation table created');
    })
    .catch((err) => {
        console.log(err);
    });
module.exports = meditation