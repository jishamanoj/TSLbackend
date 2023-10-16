// registrationModel.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
    dialect: 'mysql'
});

const reg = sequelize.define('reg', {
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    DOB: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    reference: { type: DataTypes.STRING },
    language: { type: DataTypes.STRING },
    remark: { type: DataTypes.STRING }
}, {
    timestamps: false,
})
reg.sync({alter:true}).then((data)=>{
        console.log(data);
        console.log('table created');
    })
    .catch((err)=>{
        console.log(err);
    });

module.exports = reg;

