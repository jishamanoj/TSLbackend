const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize("sequel", "root", "E@asybiz_d@_t@b@se_1234567", {
    dialect: "mysql",
    logging: false,

});
const questions = sequelize.define('questions', {
    question: { type: DataTypes.TEXT },
},
 {
    timestamps: false,
})
questions.sync({alter: true}).then((data)=>{
    console.log("questions table create ");
})
.catch((err)=>{
    console.log(err);
}
);
module.exports = questions;