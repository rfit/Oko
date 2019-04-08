// Firebase Setup
const admin = require('firebase-admin');
var db = admin.firestore();

const keys = require('../serviceAccountKey');
const request = require('request');

const data = require('../data/teams-2019');
var requiredTeamId = data.requiredTeamId;
var requiredAdmins = data.requiredAdmins;

/*
var userRef = db.collection('users').where('email', '==', 'stine.eisen@roskilde-festival.dk');
  
userRef.get().then(snapshot => {
      snapshot.docs.forEach(doc => {
              console.log('Document data:', doc.id, doc.data());
          })
      }).catch(err => {
        console.log('Error getting document', err);
        return err;
    });
*/
/*
var userRef = db.collection('users').where('teams', 'array-contains', 6822);
  
userRef.get().then(snapshot => {
      snapshot.docs.forEach(doc => {
              console.log('Document data:', doc.id, doc.data());
          })
      }).catch(err => {
        console.log('Error getting document', err);
        return err;
    });
 */

// Loop through all admins and create. 
requiredAdmins.forEach(function(entry) {

    // People REST API: GetTeams (Get all teams in people)
    var RestMember = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetMemberDataById/?Id=' + entry + '&ApiKey=';

    request(RestMember + keys.RestAPIKey, function (error, response, body) {
            //console.log('error:', error); // Print the error if one occurred
            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            const PeopleData = JSON.parse(body);
            module.exports = PeopleData;
                
            // Find users that are admins / "Holdleder". If not users is "basis"
            if (PeopleData.Member.MemberId === entry) {
                
                var tempUser = {
                    email: PeopleData.Member.Email,
                    name: PeopleData.Member.Name,
                    peopleId: PeopleData.Member.MemberId,
                    role: 'Admin',
                    teams: requiredTeamId
                };
            
                // Add user to firestore if admin
                var addUser = db.collection('users').doc(`${PeopleData.Member.MemberId}`).set(tempUser).then(ref => {
                    return ref;
                }).catch(err => {
                    console.log('Error getting document', err);
                    return err;
                });
            }
        });
});

// Loop through all team and create if not exists. Also editors (holdleder) are created for each team.
requiredTeamId.forEach(function(entry) {

    // People REST API: GetTeams (Get all teams in people)
    var RestTeams = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetTeams/?ApiKey=';

    request(RestTeams + keys.RestAPIKey, function (error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        const PeopleData = JSON.parse(body);
        module.exports = PeopleData;
    
        // Loop through a whole team
        Object.keys(PeopleData.Teams).forEach(function (item) {
            
                // Find team based on TeamId
                if (PeopleData.Teams[item].TeamId === entry) {
                    //console.log('body:', PeopleData.Teams[item]);
    
                    var tempTeam = {
                        measurement: 'null',
                        name: PeopleData.Teams[item].TeamName,
                        peopleId: PeopleData.Teams[item].TeamId,
                        id: PeopleData.Teams[item].TeamId
                    };
                
                    return db.collection('teams').doc(`${entry}`).get()
                    .then(doc => {
                        if (!doc.exists) {
                            // Add team to firestore if admin
                            var addTeam = db.collection('teams').doc(`${PeopleData.Teams[item].TeamId}`).set(tempTeam).then(ref => {
                                console.log('Team do not exists: ', tempTeam);
                                return ref;
                            }).catch(err => {
                                console.log('Error getting document', err);
                                return err;
                            });
                            
                        } else {
                            //console.log("Team already exists: ", doc.data().name);
                            return doc.data();
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        return err;
                        //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                    })   
                }
        });
    });

    // People REST API: GetTeamMember pr. teamID
    var RestTeam = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetTeamMembers/?teamId=' + entry + '&ApiKey=';

    request(RestTeam + keys.RestAPIKey, function (error, response, body) {
        //console.log('error:', error); // Print the error if one occurred
        //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        const PeopleData = JSON.parse(body);
        module.exports = PeopleData;

        // Loop through a whole team
        Object.keys(PeopleData.TeamMembers).forEach(function (item) {
            var tempUser = {};
                // Find users that are admins / "Holdleder". If not users is "basis"
                if (PeopleData.TeamMembers[item].RoleName === 'Holdleder') {
                    //console.log('body:', PeopleData.TeamMembers[item]);

                    tempUser = {
                        email: PeopleData.TeamMembers[item].Email,
                        name: PeopleData.TeamMembers[item].MemberName,
                        peopleId: PeopleData.TeamMembers[item].MemberId,
                        id: PeopleData.TeamMembers[item].MemberId,
                        role: 'Admin',
                        teams: [PeopleData.TeamMembers[item].TeamId]
                    };
                

                    return db.collection('users').doc(`${entry}`).get()
                    .then(doc => {
                        if (!doc.exists) {
                            // Add user to firestore if admin
                            db.collection('users').doc(`${PeopleData.TeamMembers[item].MemberId}`).set(tempUser).then(ref => {
                                return ref;
                            }).catch(err => {
                                console.log('Error getting document', err);
                                return err;
                            });
                        } else {
                            db.collection('users').doc(`${PeopleData.TeamMembers[item].MemberId}`).update({
                                teamId: admin.firestore.FieldValue.arrayUnion(PeopleData.TeamMembers[item].TeamId)
                            }).then(ref => {
                                return ref;
                            }).catch(err => {
                                console.log('Error getting document', err);
                                return err;
                            });
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        return err;
                        //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                    }) 


                    

                    // Find users that are admins / "Ansvarlig".
                } else if (PeopleData.TeamMembers[item].TitleName === 'Ansvarlig') {
                    //console.log('body:', PeopleData.TeamMembers[item]);

                    tempUser = {
                        email: PeopleData.TeamMembers[item].Email,
                        name: PeopleData.TeamMembers[item].MemberName,
                        peopleId: PeopleData.TeamMembers[item].MemberId,
                        id: PeopleData.TeamMembers[item].MemberId,
                        role: 'Admin',
                        teams: [PeopleData.TeamMembers[item].TeamId]
                    };
                
                    return db.collection('users').doc(`${entry}`).get()
                    .then(doc => {
                        if (!doc.exists) {
                            // Add user to firestore if admin
                            db.collection('users').doc(`${PeopleData.TeamMembers[item].MemberId}`).set(tempUser).then(ref => {
                                return ref;
                            }).catch(err => {
                                console.log('Error getting document', err);
                                return err;
                            });
                        } else {
                            db.collection('users').doc(`${PeopleData.TeamMembers[item].MemberId}`).update({
                                teamId: admin.firestore.FieldValue.arrayUnion(PeopleData.TeamMembers[item].TeamId)
                            }).then(ref => {
                                return ref;
                            }).catch(err => {
                                console.log('Error getting document', err);
                                return err;
                            });
                        }
                    })
                    .catch(err => {
                        console.log('Error getting document', err);
                        return err;
                        //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                    }) 

                }
        });

    });
});
                