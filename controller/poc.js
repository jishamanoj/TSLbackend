const express = require('express');
const TreeData = require('../model/treedata');
const router = express.Router();
const axios = require('axios');

const Sequelize = require('sequelize');

// async function insertMember(member) {
//     // Get the current level
//     const currentLevel = await TreeData.count({
//       where: {
//         level: {
//           [Sequelize.Op.lt]: Sequelize.literal('(SELECT MAX(level) FROM treedata)'),
//         },
//       },
//     });
  
//     // Update the member's level
//     member.level = currentLevel + 1;
  
//     // Save the member to the database
//     await TreeData.save(member);
  
//     // Return the member object
//     return member;
//   }
  
//   // Create an API endpoint to insert a member
//   router.post('/insertMember', async (req, res) => {
//     // Create a new member object
   

//     const member = {};
//     console.log('Level before: ', member.level);
//     // Insert the member into the database
//      member = await insertMember(member);
//     console.log('Level after: ', member.level);
//     // Respond with the new member object
//     res.json(member);
//   });








// const insertPerson = async (data, parent = null) => {
//     if (!parent) {
//       // Find the root node at the 0th level (top-level parent)
//       const root = await TreeData.findOne({ where: { level: 0, parentId: null } });
  
//       if (root) {
//         parent = root.id; // Set the parent to the root node's ID
//       }
//     }
  
//     // Insert the data
//     const newData = await TreeData.create({
//       name: data.name,
//       age: data.age,
//       phone: data.phone,
//       email: data.email,
//       gender: data.gender,
//       level: parent === null ? 0 : TreeData.level + 1,
//       parentId: parent,
//     });
  
//     return newData;
//   };
  
//   router.post('/insertPerson', async (req, res) => {
//     try {
//       const { name, age, phone, email, gender } = req.body;
  
//       // Insert the person into the tree structure
//       const insertedPerson = await insertPerson({
//         name,
//         age,
//         phone,
//         email,
//         gender,
//       });
  
//       res.status(201).json(insertedPerson);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });


// router.post('/registerParent', async (req, res) => {
//     try {
//       // Get the parent data from the request body
//       const { name, age, phone, email, gender } = req.body;
  
//       // Register the parent with level 1
//       const parent = await TreeData.create({
//         name,
//         age,
//         phone,
//         email,
//         gender,
//         level: 1,
//         parentId: null, // Since it's a parent, there is no parent ID
//       });
//       const child = {};
//       // Set the initial level and parent ID for the child nodes
//       const level = 1;
//       let parentId = parent.id;
  
//       if (level <= 1) {
//         // Register the children based on the level
//         for (let i = 1; i <= level * 3; i++) {
//             const l = level;
//             // Adjust this logic to customize child data as needed
//             const child = {};
//             child.name = child.name;
//             child.age = child.age;
//             child.phone = child.phone;
//             child.email = child.email;
//             child.gender = child.gender;
//             child.level = l;
//             child.parentId = parentId;
        
//             // Create the child node
//             await TreeData.create(child);
//           }
  
//         // Increment the level for the next iteration
//         level += 1;
//       }
  
//       // Return a success response to the client
//       res.status(201).json({ message: 'Parent and children registered successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   });



router.post('/insert', async (req, res) => {
  try {
          const { name, age, phone, email, gender } = req.body;
          
  } catch (error) {
  }
      
 })




module.exports = router;