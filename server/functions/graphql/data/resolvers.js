const admin = require('firebase-admin');

const uuidv4 = require('uuid/v4');
const request = require('request');

var db = admin.firestore();

const resolvers = {
    Query: {
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
    },
    User: {
        //Eksempel på custom felter, udfra de eksisterende
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
        }
    },
    
    Mutation: {
        
        addUser: (parent, args) => {
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
        removeUser: (parent, args) => {
            
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
      },
    
};
  
module.exports = resolvers;
