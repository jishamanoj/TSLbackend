
const { DataTypes, Sequelize } = require('sequelize');
//const bcrypt = require('bcrypt');
const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
    dialect: 'mysql',
    logging: false,
    
});
const validUser = sequelize.define('validuser', {
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    DOB: { type: DataTypes.STRING },
    gender: { type: DataTypes.STRING },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    address: { type: DataTypes.STRING },
    pincode: { type: DataTypes.INTEGER },
    state: { type: DataTypes.STRING },
    district: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    reference: { type: DataTypes.STRING },
    languages: DataTypes.STRING,
    remark: { type: DataTypes.TEXT },
    userId: {
        type: DataTypes.INTEGER,
        
      },
    DOJ: { type: DataTypes.DATE, allowNull: true },
    expiredDate: { type: DataTypes.DATE, allowNull: true },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
 });
const BankDetails = sequelize.define('bankDetails', {
    AadarNo: { type: DataTypes.INTEGER,defaultValue:0 },
    IFSCCode: { type: DataTypes.STRING,defaultValue:0},
    branchName: { type: DataTypes.STRING,defaultValue:0},
    accountName: { type: DataTypes.STRING,defaultValue:0},
    accountNo: { type: DataTypes.INTEGER,defaultValue:0},
});
validUser.hasOne(BankDetails);

sequelize.sync()
    .then((data) => {
       // console.log(data);
        console.log('validuser table created');
    })
    .catch((err) => {
        console.log(err);
    });



module.exports = { validUser, BankDetails };



