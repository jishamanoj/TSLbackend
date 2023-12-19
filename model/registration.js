// const { DataTypes, Sequelize } = require('sequelize');

// const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
//     dialect: 'mysql',
//     logging: false,
// });

// const reg = sequelize.define('reg', {
//     first_name: { type: DataTypes.STRING },
//     last_name: { type: DataTypes.STRING },
//     DOB: { type: DataTypes.STRING },
//     gender: { type: DataTypes.STRING },
//     email: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: true,
//     },
//     address: { type: DataTypes.STRING },
//         pincode: { type: DataTypes.INTEGER },
//         state: { type: DataTypes.STRING },
//         district: { type: DataTypes.STRING },
//     country: { type: DataTypes.STRING },
//     phone: {
//         type: DataTypes.STRING,
//         unique: true,
//         allowNull: true,
//     },
//     reference: { type: DataTypes.STRING },
//     languages: DataTypes.STRING,
//     remark: { type: DataTypes.TEXT },
//     verify: { type: DataTypes.STRING, defaultValue: 'false' },
//     userId: {
//         type: DataTypes.INTEGER,
//         defaultValue: 4000,
//     },
//     classAttended: { type: DataTypes.STRING, defaultValue: 'false' },
//     DOJ: { type: DataTypes.DATE, allowNull: true },
//     expiredDate: { type: DataTypes.DATE, allowNull: true },
//     password: { type: DataTypes.STRING ,
//         allowNull: false,
//     },

// });

// const BankDetails = sequelize.define('bankDetails', {
//     AadarNo: { type: DataTypes.INTEGER, defaultValue: 0 },
//     IFSCCode: { type: DataTypes.STRING, defaultValue: 0 },
//     branchName: { type: DataTypes.STRING, defaultValue: 0 },
//     accountName: { type: DataTypes.STRING, defaultValue: 0 },
//     accountNo: { type: DataTypes.INTEGER, defaultValue: 0 },

// });

// reg.hasOne(BankDetails);

// sequelize.sync()
//     .then(() => {
//         console.log('reg table created');
//     })
//     .catch((err) => {
//         console.error('Error syncing reg table:', err);
//     });

// module.exports = { reg, BankDetails };


const { DataTypes, Sequelize } = require('sequelize');
//const bcrypt = require('bcrypt');
const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
    dialect: 'mysql',
    logging: false,
    
});
const reg = sequelize.define('reg', {
    first_name: { type: DataTypes.STRING,defaultValue: ''},
    last_name: { type: DataTypes.STRING,defaultValue: ''},
    DOB: { type: DataTypes.STRING,defaultValue: '' },
    gender: { type: DataTypes.STRING,defaultValue: '' },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    address: { type: DataTypes.STRING,defaultValue: '' },
    pincode: { type: DataTypes.INTEGER,defaultValue: 0 },
    state: { type: DataTypes.STRING ,defaultValue: ''},
    district: { type: DataTypes.STRING,defaultValue: '' },
    country: { type: DataTypes.STRING,defaultValue: '' },
    phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    reference: { type: DataTypes.STRING,defaultValue: '' },
    languages: {type:DataTypes.STRING,defaultValue: ''},
    remark: { type: DataTypes.TEXT,defaultValue: '' },
    verify: { type: DataTypes.STRING, defaultValue: 'false' },
    userId: {
        type: DataTypes.INTEGER,
        defaultValue: 4000,
        
      },
    DOJ: { type: DataTypes.DATE, allowNull: true },
    expiredDate: { type: DataTypes.DATE, allowNull: true },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        
    },
    classAttended: { type: DataTypes.STRING, defaultValue: 'false' },
 });
const BankDetails = sequelize.define('bankDetails', {
    AadarNo: { type: DataTypes.INTEGER,defaultValue:0 },
    IFSCCode: { type: DataTypes.STRING,defaultValue:""},
    branchName: { type: DataTypes.STRING,defaultValue:""},
    accountName: { type: DataTypes.STRING,defaultValue:""},
    accountNo: { type: DataTypes.INTEGER,defaultValue:0},
});

reg.hasOne(BankDetails);


sequelize.sync({alter:true})
    .then((data) => {
       // console.log(data);
        console.log('reg table created');
    })
    .catch((err) => {
        console.log(err);
    });


    


module.exports = { reg, BankDetails };



