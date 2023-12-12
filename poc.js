const {Users,sequelize} = require('./db');
const randomNames = [
    'Alice', 'Bob', 'Charlie', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Katherine', 'Liam', 'Mia', 'Noah', 'Olivia', 'Penelope', 'Quinn', 'Ryan', 'Sophia', 'Thomas',
    'Uma', 'Victor', 'Willow', 'Xander', 'Yasmine', 'Zane'
];

async function runStoredProcedures() {
    for (let i = 0; i < 10; i++) {
        try {
            const res = await sequelize.query(`CALL referUser('${randomNames[0]}','${randomNames[0]}','2000-01-01','1234567','${randomNames[0]}@gmail.com','kerala','alappuzha')`);
            if(res){
                
                
                
            
                let LastUserID = res[0]['LastUserID']
                // console.log('Last inserted user ID:', LastUserID,res[0]);
                
                

                const referers = await sequelize.query(`CALL GetReferrerTreeWithCorrection('${LastUserID}')`);
                const list = referers[0]
                const list_of_referers = [list.Sam_Referrer,list.Level_2_Referrer,list.Level_3_Referrer,list.Level_4_Referrer,list.Level_5_Referrer,list.Level_6_Referrer,list.Level_7_Referrer,list.Level_8_Referrer,list.Level_9_Referrer,list.First_ID]
           
           
        //    console.log(list)
        //    console.log(list_of_referers)
    sequelize.query(`SELECT count FROM users`).then((res)=>{
        console.log(res)
    })
           list_of_referers.forEach((i)=>{
                sequelize.query(`SELECT UserID,points,coupons,shared_points,Level,count FROM Users WHERE UserID = '${i}'`).then((res)=>{
                    // console.log(res)
                    
                    
                    let userdetails = res[0]
                    let {UserID,coupons,points,shared_points,Level,count} = userdetails[0]
                    // console.log(user_details[0].coupons,'hai')
                    if(coupons === 0){
                    
                        // console.log(coupons,points,UserID,Level,'userdata')
                        




                        sequelize.query(`UPDATE Users SET points = ${points+250},count = ${count+1}  WHERE UserID = '${UserID}' `).then((res)=>{
                        sequelize.query(`SELECT UserID,points,coupons,count,count_number FROM Users WHERE UserID = '${i}'`).then((res)=>{
                            let userdetails = res[0]
                            let {UserID,coupons,points,count_number} = userdetails[0]
                            sequelize.query(`UPDATE Users SET count = ${count+1} WHERE UserID = '${UserID}'`).then((res)=>{
                                sequelize.query(`SELECT UserID,points,coupons,count,count_number FROM Users WHERE UserID = '${i}'`).then((res)=>{
                            let userdetails = res[0]
    
                            let {UserID,coupons,points,count_number,count} = userdetails[0]
    
                            // console.log('else',count,count_number);
                                    if(count === 10){
                                        console.log('count is 10')
                                        sequelize.query(`UPDATE Users SET count = 0,count_number = ${count_number+1} WHERE UserID = '${UserID}'`).then((res)=>{
                                            console.log(res)
                                        })
                                    }
                                })
                            })

                            if(points === 2500){
                            sequelize.query(`UPDATE Users SET points = 0,coupons = ${coupons+1}  WHERE UserID = '${UserID}'`).then((res)=>{

                            })
                        }
                        })
                    })
                }
                else{
                   // console.log("..................................else.................");
                    sequelize.query(`SELECT UserID,points,coupons,count,count_number FROM Users WHERE UserID = '${i}'`).then((res)=>{
                        let userdetails = res[0]

                        let {UserID,coupons,points,count_number,count} = userdetails[0]
                        sequelize.query(`UPDATE Users SET count = ${count+1} WHERE UserID = '${UserID}'`).then((res)=>{
                            sequelize.query(`SELECT UserID,points,coupons,count,count_number,Level FROM Users WHERE UserID = '${i}'`).then((res)=>{
                        let userdetails = res[0]


                        let {UserID,coupons,points,count_number,count,Level} = userdetails[0]
console.log("UserID,coupons,points,count_number,count,Level",UserID,coupons,points,count_number,count,Level);

                        console.log('else',count,count_number);
                                if(count >=10){
                                    console.log('count is 10')
                                    sequelize.query(`UPDATE Users SET count = 0, count_number = ${count_number + 1} WHERE UserID = '${UserID}'`).then((res) => {

                                    });
                                }
                                if (count_number % 2 !== 0) {
                                    console.log('////////////////////////count_number % 2 !== 0///////////////////// ');
                                    // Select one node of the same level where coupons < UserID
                                    sequelize.query(`SELECT UserID, coupons FROM Users WHERE Level = '${Level}' AND coupons < ${coupons} LIMIT 1`).then((res) => {
                                        let selectedNode = res[0][0];
                                        console.log('Selected Node:..........................................', selectedNode);
        
                                        if (selectedNode) {
                                            // Your logic for the selected node
                                            console.log('Selected Node:..........................................', selectedNode);
                                            if (userdetails[0].points < 2500) {
                                                sequelize.query(`UPDATE Users SET points = ${userdetails[0].points + 250} WHERE UserID = '${selectedNode.UserID}'`).then((res) => {
                                                    // Handle the result if needed
                                                });
                                            }
                                            if (userdetails[0].points === 2500) {
                                                sequelize.query(`UPDATE Users SET points = 0, coupons = ${selectedNode.coupons + 1} WHERE UserID = '${selectedNode.UserID}'`).then((res) => {
                                                    // Handle the result if needed
                                                });
                                            }
                                        }
                                        else{
                                            console.log("@@@@@@@@@@@@@@@@@@@@@@@@!selectedNode@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                                            if (userdetails[0].points < 2500) {
                                                console.log("@@@@@@@@@@@@@@@@@@@@@@@@userdetails[0].points < 2500@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                                                sequelize.query(`UPDATE Users SET points = ${userdetails[0].points + 250} WHERE UserID = '${UserID}'`).then((res) => {
                                                    // Handle the result if needed
                                                });
                                            }
                                            // Increase coupons if points reach 2500
                                            if (userdetails[0].points === 2500) {
                                                console.log("@@@@@@@@@@@@@@@@@@@@@@@@userdetails[0].points === 2500@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

                                                sequelize.query(`UPDATE Users SET points = 0, coupons = ${userdetails[0].coupons + 1} WHERE UserID = '${UserID}'`).then((res) => {
                                                    // Handle the result if needed
                                                });
                                            }
 
                                        }
                                    });
                                }
                                else{
                                    console.log("**************************point*****************************");
                                    if (userdetails[0].points < 2500) {
                                        console.log("**************************userdetails[0].points < 2500*****************************");

                                        sequelize.query(`UPDATE Users SET points = ${userdetails[0].points + 250} WHERE UserID = '${UserID}'`).then((res) => {
                                            // Handle the result if needed
                                        });
                                    }
                                    if (userdetails[0].points === 2500) {
                                        console.log("*************************userdetails[0].points === 2500*****************************");

                                        sequelize.query(`UPDATE Users SET points = 0, coupons = ${userdetails[0].coupons + 1} WHERE UserID = '${UserID}'`).then((res) => {
                                            // Handle the result if needed
                                        });
                                    }
                                }
                            })
                        })
                        //if(count_number % 2 != 0){
                   // sequelize.query(`SELECT UserID,points,coupons,count,count_number FROM Users WHERE UserID = '${i}'`).then((res)=>{

                   // })
                       // }
                    })
                }

           })
        })
            }

        }
        catch(err){
        
            
            console.log(err);
        }
    }
    
}

runStoredProcedures()




















