const admin = require('firebase-admin');
const uuidv4 = require('uuid/v4');
const request = require('request');

var serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

const resolvers = {
    Query: {
        login: (parent,args) => {
            
            //const loginUser = 'mikael.soerensen@roskilde-festival.dk';
            
            const loginPassword = serviceAccount.LoginTempPW;

            const UserLogin = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/AuthenticateMember/?username=' + args.user + '&password=' + loginPassword + '&ApiKey=' + serviceAccount.RestAPIKey;
            console.log("hej");
            console.log(UserLogin);
            
            /*
            request(UserLogin + serviceAccount.RestAPIKey, function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                const PeopleData = JSON.parse(body);
                console.log('body:', PeopleData); // Print the HTML for the Google homepage.
                console.log("hej2");
                return true;
            });*/


            return new Promise(function(resolve, reject) {
            // Do async job
                request.get(UserLogin + serviceAccount.RestAPIKey, function (error, response, body) {
                       if (err) {
                        reject(err);
                       } else {
                        console.log(JSON.parse(body));
                        resolve(JSON.parse(body));
                        
                       }
                   })
               });


        },
        users: () => {
            return db.collection('users').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var userArray = [];
                snapshot.forEach(doc => {
                    //console.log('Document data:', doc.data());
                    userArray.push(doc.data());
                });
                return userArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        user: (parent,args) => {
            return db.collection('users').doc(`${args.id}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    return null;
                } else {
                    //console.log('Document data:', doc.data());
                    return doc.data();
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        teams: () => {
            return db.collection('teams').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var teamArray = [];
                snapshot.forEach(doc => {
                //console.log('Document data:', doc.data());
                    teamArray.push(doc.data());
                });
                return teamArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        team: (parent,args) => {
            return db.collection('teams').doc(`${args.id}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    return null;
                } else {
                    console.log('Team Document data:', doc.data());
                    return doc.data();
                }
            })
            .catch(err => {
                //console.log('Error getting document', err);
                return err;
            })
        },
        bills: () => {
            return db.collection('bills').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var userArray = [];
                snapshot.forEach(doc => {
                    //console.log('Bill data:', userArray);
                    userArray.push(doc.data());
                    
                });
                //console.log('End Bill data:', userArray);
                return userArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        bill: (parent,args) => {
            return db.collection('bills').doc(`${args.id}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    return null;
                } else {
                    //console.log('Document data:', doc.data());
                    return doc.data();
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },  
    },
    User: {
        //Eksempel på custom felter, udfra de eksisterende
        username: user => `${user.memberName} ${user.memberId}`, 
        team: user => {
            return db.collection('teams').doc(`${user.teamId}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!', user.teamId);
                    return null;
                } else {
                    console.log('Team users Document data:', doc.data());
                    return doc.data();
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        teams: user => {
            return db.collection('teams').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var teamArray = [];
                snapshot.forEach(doc => {
                    if( doc.data().teamId === user.teamId ) {
                        teamArray.push(doc.data());
                    }
                });
                return teamArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
          
      },
    Team: {
        users: team => {
            return db.collection('users').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var userArray = [];
                snapshot.forEach(doc => {
                    if( doc.data().teamId === team.teamId ) {
                        userArray.push(doc.data());
                    }
                });
                return userArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        bills: team => {
            return db.collection('bills').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var userArray = [];
                snapshot.forEach(doc => {
                    if( doc.data().teamId === team.teamId ) {
                        userArray.push(doc.data());
                    }
                });
                return userArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        }
    },
    
    Mutation: {
        createTeam: (parent, args) => {
            const team = {
                teamId: args.teamId,
                teamName: args.teamName,
                teamParentId: args.teamParentId,
                CopyOfTeamId: args.CopyOfTeamId
            };

            return db.collection('teams').doc(args.teamId).get()
            .then(doc => {
                if (!doc.exists) {
                    return addTeam = db.collection('teams').doc(args.teamId).set(team)
                    .then(ref => {
                        console.log("Team Added: ", team);
                        return team;
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                        return err;
                    });
                } else {
                    console.log('Team already exists:', doc.data());
                    //return doc.data();
                    throw new Error(`Team already exists.`); 
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
                //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
            })
        },
        deleteTeam: (parent, args) => {
            
            return db.collection('teams').doc(`${args.teamId}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log("Team Not Found");
                    return false;
                    
                } else {

                    return addTeam = db.collection('teams').doc(args.teamId).delete()
                    .then(ref => {
                        console.log("Team Deleted");
                        return true;
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        return true;
                    });
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
                //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
            })
        },
        createUser: (parent, args) => {
            const user = {
                memberId: args.memberId,
                memberNumber: args.memberNumber,
                memberName: args.memberName,
                email: args.email,
                roleName: args.roleName,
                teamId: args.teamId,
            };

            return db.collection('users').doc(args.memberId).get()
            .then(doc => {
                if (!doc.exists) {
                    return addTeam = db.collection('users').doc(args.memberId).set(user)
                    .then(ref => {
                        console.log("User Added: ", user);
                        return user;
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                        return err;
                    });
                } else {
                    console.log('User already exists:', doc.data());
                    //return doc.data();
                    throw new Error(`User already exists.`); 
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
                //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
            })
        },
        deleteUser: (parent, args) => {
            
            return db.collection('users').doc(`${args.memberId}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log("User Not Found");
                    return false;
                    
                } else {

                    return addUser = db.collection('users').doc(args.memberId).delete()
                    .then(ref => {
                        console.log("User Deleted");
                        return true;
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        return true;
                    });
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
                //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
            })
        },
        createBill: (parent, args) => {
            var today = new Date();
            var month = today.getMonth()+1;
            var thisDate = today.getFullYear() + '-' + month + '-' + today.getDate();

            const bill = {
                id: args.id,
                created: thisDate,
                oko: args.oko,
                nonoko: args.nonoko,
                teamId: args.teamId,
            };

            return db.collection('bills').doc(args.id).get()
            .then(doc => {
                if (!doc.exists) {
                    return addBill = db.collection('bills').doc(args.id).set(bill)
                    .then(ref => {
                        console.log("Bill Added: ", bill);
                        return bill;
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                        return err;
                    });
                } else {
                    console.log('Bill already exists:', doc.data());
                    //return doc.data();
                    throw new Error(`User already exists.`); 
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
                //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
            })
        },
        deleteBill: (parent, args) => {
            
            return db.collection('bills').doc(`${args.id}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log("Bill Not Found");
                    return false;
                    
                } else {

                    return addBill = db.collection('bills').doc(args.id).delete()
                    .then(ref => {
                        console.log("Bill Deleted");
                        return true;
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        return true;
                    });
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
                //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
            })
        },
      },
    
};
  
module.exports = resolvers;
