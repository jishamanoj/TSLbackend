// // Define the model for the tree structure
// const { DataTypes, Sequelize } = require('sequelize');
// const sequelize = new Sequelize('sequel', 'root', 'pass@123', {
//     dialect: 'mysql'
// });
// const TreeData = sequelize.define('TreeData', {
//     name:{type:DataTypes.STRING},
//     age: {type:DataTypes.INTEGER},
//     phone: {type:DataTypes.STRING},
//     email: {type:DataTypes.STRING},
//     gender: {type:DataTypes.STRING},
//     level: {type:DataTypes.INTEGER},
//     parentId: {type:DataTypes.INTEGER}, // The parent node's ID
// }, {
//     timestamps: false,
// })

// // Synchronize the TreeData model with the database
// TreeData.sync({ alter: true })
//     .then((data) => {
//         console.log('TreeData table created or altered');
//     })
//     .catch((err) => {
//         console.log('Error creating or altering TreeData table:', err);
//     });

// module.exports = TreeData;

