const admin = require('firebase-admin');
var db = admin.firestore();


const request = require('request');
const rp = require('request-promise-native');
const keys = require('../../serviceAccountKey');

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
                var tempArray = {};
                snapshot.forEach(doc => {
                    tempArray = doc.data();
                    //tempArray.createdDate = new Date(doc.data().createdDate.toDate());
                    //console.log('tempArray.createdDate', tempArray.createdDate);
                    tempArray.id = doc.id;
                    invoiceArray.push(tempArray);
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
                var tempArray = {};
                snapshot.forEach(doc => {
                    tempArray = doc.data();
                    //tempArray.createdDate = new Date(doc.data().createdDate.toDate());
                    tempArray.id = doc.id;
                    invoiceArray.push(tempArray);
                    //console.log('invoiceArray: ', invoiceArray);
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
       /* addUser: (parent, args) => {         
            // People REST API: GetTeams (Get all teams in people)
            var RestMember = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetTeamMembers/?teamId=' + args.teamId + '&ApiKey=';
            var myURL = RestMember + keys.RestAPIKey;

            async function processData() {
                try {
                  let response = await rp(myURL);
                  const PeopleData = JSON.parse(response);

                    Object.keys(PeopleData.TeamMembers).forEach(function (item) {
                        // Find users that are admins / "Holdleder". If not users is "basis"
                        if (PeopleData.TeamMembers[item].Email === args.email) {

                            var user = {
                                id: PeopleData.TeamMembers[item].MemberId,
                                email: PeopleData.TeamMembers[item].Email,
                                name: PeopleData.TeamMembers[item].MemberName,
                                peopleId: PeopleData.TeamMembers[item].MemberId,
                                role: 'Editor',
                                teams: [args.teamId]
                            };
                            console.log('user ', user);

                            return db.collection('users').doc(`${user.peopleId}`).get()
                            .then(doc => {
                                if (!doc.exists) {
                                    return addUser = db.collection('users').doc(`${user.peopleId}`).set(user)
                                    .then(ref => {
                                        console.log("User Added: ", user);
                                        return doc.data();
                                    })
                                    .catch(err => {
                                        console.log('Error getting document', err);
                                        //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                                        return err;
                                    });
                                } else {
                                    console.log('User already exists:', doc.data());
                                    //return doc.data();
                                    //throw new Error(`User already exists.`);
                                    return Error(`User already exists.`, doc.data());
                                }
                            })
                            .catch(err => {
                                console.log('Error getting document', err);
                                return err;
                                //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                            })
                        } 
                    })
                } catch (error) {
                  console.log("Error: ", error);
                }
              }
              processData();   
        },*/
        removeUser: (parent, args) => {
            
            return db.collection('users').doc(`${args.id}`).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log("User Not Found");
                    return false;
                    
                } else {

                    return addUser = db.collection('users').doc(`${args.id}`).delete()
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
