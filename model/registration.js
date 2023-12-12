
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
    dialect: 'mysql',
    logging: false,
});

const reg = sequelize.define('reg', {
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    DOB: { type: DataTypes.STRING },
    gender : { type: DataTypes.STRING },
    email: { type: DataTypes.STRING ,
    unique: true,
    allowNull: true
},
    country: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING ,
        unique: true,
        allowNull: true},
    reference: { type: DataTypes.STRING },
   languages: DataTypes.STRING,
    remark: { type: DataTypes.TEXT},
    otp: { type: DataTypes.STRING },
    verify: { type: DataTypes.STRING,
        defaultValue: 'false'},
        userId :{
          type: DataTypes.INTEGER,
          defaultValue: 4000      
        },
        otpTimestamp: { 
            type: DataTypes.DATE,
            allowNull: true
        },
        DOJ: { type: DataTypes.DATE,
            allowNull: true
        },
        expiredDate : { type: DataTypes.DATE,
            allowNull: true
        },
            password : { type: DataTypes.STRING},
}, 
{
    timestamps: false,
})
reg.sync()
.then((data)=>{
        console.log(data);
        console.log('reg table created');
    })
    .catch((err)=>{
        console.log(err);
    }
    );

module.exports = reg;

