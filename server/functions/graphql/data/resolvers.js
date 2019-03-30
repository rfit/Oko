const admin = require('firebase-admin');
var db = admin.firestore();

const uuidv4 = require('uuid/v4');
const request = require('request');

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
                    //console.log('Team Document data:', doc.data());
                    return doc.data();
                }
            })
            .catch(err => {
                //console.log('Error getting document', err);
                return err;
            })
        },
        allinvoices: () => {
            return db.collection('invoices').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var invoiceArray = [];
                snapshot.forEach(doc => {
                //console.log('Document data:', doc.data());
                    invoiceArray.push(doc.data());
                });
                return invoiceArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        invoices: (parent,args) => {
            return db.collection('invoices').where('teamId', '==', args.teamId).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var invoiceArray = [];
                snapshot.forEach(doc => {
                //console.log('Document data:', doc.data());
                    invoiceArray.push(doc.data());
                });
                return invoiceArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        invoice: (parent,args) => {
            return db.collection('invoices').doc(`${args.id}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document!');
                    return null;
                } else {
                    console.log('Invoice Document data:', doc.data());
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
                    user.teams.forEach(team => {
                        if( doc.data().peopleId === team ) {
                            teamArray.push(doc.data());
                        }
                    })

                }); 
                return teamArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        invoices: user => {
            return db.collection('invoices').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var teamArray = [];
                snapshot.forEach(doc => {
                    user.teams.forEach(team => {
                        if( doc.data().teamId === team ) {
                            teamArray.push(doc.data());
                        }
                    })
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
                    doc.data().teams.forEach(id => {
                        if( id === team.peopleId ) {
                            userArray.push(doc.data());
                        }
                    });
                });
                return userArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
        invoices: team => {
            return db.collection('invoices').where('teamId', '==', team.peopleId).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document!');
                    return;
                } 
                
                var invoiceArray = [];
                snapshot.forEach(doc => {
                    invoiceArray.push(doc.data());
                });
                return invoiceArray;
            })
            .catch(err => {
                console.log('Error getting document', err);
                return err;
            })
        },
    },
    

/*
get().then(snapshot => {
      snapshot.docs.forEach(doc => {
              console.log('Document data:', doc.id, doc.data());
          })
      }).catch(err => {
        console.log('Error getting document', err);
        return err;
    });
*/
    Mutation: {
        addUser: (parent, args) => {
            const user = {
                peopleId: 99999, //args.peopleId,
                name: 'Mikael Test', //args.name,
                email: args.email,
                role: 'editor'
            };
            console.log('args.email', args.email);
            return db.collection('users').where('email', '==', args.email).get()
            .then(snapshot => {
                snapshot.docs.forEach(doc => {
                    console.log('doc', doc.data());
                    if (!doc.exists) {
                        return addUser = db.collection('users').doc(args.peopleId).set(user)
                        .then(function() {
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
