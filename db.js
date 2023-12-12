const express = require('express')
const app = express()
const cors = require('cors')
const { Sequelize, DataTypes } = require('sequelize');




const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
    host: 'localhost',
    dialect:'mysql'
  });
const Users = sequelize.define('Users', {
    UserId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: {
        type: DataTypes.STRING(40),
        allowNull: false,
    },
    secondName: {
        type: DataTypes.STRING(40),
        allowNull: true,
    },
    DOB: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true,
    },
    state: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    district: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    ReferrerID: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    Level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0

    },
    reserved_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0

    },
    coupons: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0

    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0

    },
    shared_points:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue:0

    },
    count:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0
    },
    count_number:{
        type:DataTypes.INTEGER,
        allowNull:true,
        defaultValue:0
    }
}, {
    tableName: 'Users', // Specify the table name if different from the model name
    timestamps: false,   // Set to true if you want timestamps (createdAt, updatedAt) in your table
});
// Users.sync({alter:true})
// To sync the model with the database
// sequelize.sync();

app.use(cors())





app.use(express.json())






// app.post('/register',(req,res)=>{

// })
module.exports = {sequelize,Users}