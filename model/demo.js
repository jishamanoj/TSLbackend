const {DataTypes,Sequelize} = require('sequelize');
const sequelize = new Sequelize('sequel','root','pass@123',{
    dialect:'mysql'
});
const demo = sequelize.define('demo',{
    name : {type :DataTypes.STRING },
    age : {type :DataTypes.INTEGER }
},
{
    timestamps : false,
});
demo.sync({alter : true}).then((data)=>{
    console.log("................................demo table is created...........................");

}).catch((error)=>{
    console.log(error);
});
module.exports = demo;