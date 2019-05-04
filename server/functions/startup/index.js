// Firebase Setup
const admin = require('firebase-admin');
var db = admin.firestore();
var FieldValue = require("firebase-admin").firestore.FieldValue;

const keys = require('../serviceAccountKey');
const request = require('request');

function generatePhotoUrl(email) {
    var crypto = require('crypto');
    const hash = crypto.createHash('md5').update(email).digest("hex");
    return 'https://www.gravatar.com/avatar/' + hash;
}

module.exports = function() {
    const data = require('../data/teams-2019');
    var requiredListOwnerEmail = data.requiredListOwnerEmail;
    var requiredAdmins = data.requiredAdmins;

    console.log(`Starting import of ${requiredListOwnerEmail.length} owners, and ${requiredAdmins.length} admins.`);

    var arrayListId = [];
    var arrayMemberId = [];
    var itemsProcessed = 0;

    // Loop through all admins and create. 
    requiredListOwnerEmail.forEach(function(entry) {
        // People REST API: GetTeams (Get all teams in people)
        var RestMember = 'https://people-pro.roskilde-festival.dk/Api/MemberApi/1/GetMembersByTerm/?term=' + entry + '&ApiKey=';

        request(RestMember + keys.RestAPIKey, function (error, response, body) {
                if(error) {
                    console.log('Create Error:', error); // Print the error if one occurred
                }
                //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                const PeopleData = JSON.parse(body);
                
                // Loop through a whole team
                Object.keys(PeopleData.Members).forEach(function (item, i) {
                    
                    // Find users that are admins / "Holdleder". If not users is "basis"
                    if (PeopleData.Members[item].Email === entry) {
                        
                        arrayMemberId[i] = PeopleData.Members[item].MemberId;
                        
                        return db.collection('users').doc(`${PeopleData.Members[item].MemberId}`).get()
                            .then(doc => {
                                if (!doc.exists) {
                                    admin.auth().createUser({
                                        email: PeopleData.Members[item].Email.trim(),
                                        emailVerified: false,
                                        password: 'test1234',
                                        photoURL: generatePhotoUrl(PeopleData.Members[item].Email.trim()),
                                        // phoneNumber: ;
                                        displayName: PeopleData.Members[item].Name,
                                        disabled: false
                                    })
                                    .then(function(userRecord) {
                                        // See the UserRecord reference doc for the contents of userRecord.
                                        console.log('Successfully created new user:', userRecord.uid);

                                        var tempUser = {
                                            email: userRecord.email,
                                            name: userRecord.displayName,
                                            id: PeopleData.Members[item].MemberId,
                                            peopleId: PeopleData.Members[item].MemberId,
                                            uid: Number(userRecord.uid),
                                            role: 'Admin'//,
                                            //teams: [PeopleData.Members[item].TeamMemberships[0].TeamId]
                                        };
                                        
                                        // Add user to firestore if admin
                                        db.collection('users').doc(`${userRecord.uid}`).set(tempUser).then(ref => {
                                            console.log('User added: ', tempUser);
                                            return ref;
                                        }).catch(err => {
                                            console.log('Error getting document', err);
                                            return err;
                                        });
                                        return true;
                                        
                                    })
                                    .catch(function(error) {
                                    console.log('Error creating new user:', error, PeopleData.Members[item]);
                                    });

                                
                            } else {
                                console.log('User already exists: ', doc.data().email);
                                return doc.data();
                            }
                            return true;
                        })
                        .catch(err => {
                            console.log('Error getting document', err);
                            return err;
                            //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                        })
                    }
                });
                itemsProcessed++;
                if(itemsProcessed === requiredListOwnerEmail.length) {
                    itemsProcessed = 0;
                    setTimeout(function() { callback(); }, 5000);
                }         
        });
    });

    function callback () { 
        arrayMemberId.forEach(function(entry){
            
            // People REST API: GetLists (Get all teams in people)
            var RestTeams = 'https://people-pro.roskilde-festival.dk/Api/Guest/List/1/GetLists/?memberid='+ entry +'&ApiKey=';

            request(RestTeams + keys.RestAPIKey, function (error, response, body) {
                //console.log('error:', error); // Print the error if one occurred
                //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                const PeopleData = JSON.parse(body);
            
                // Loop through a whole team
                Object.keys(PeopleData.Lists).forEach(function (item, j) {
                    
                        // Find team based on TeamId
                        if (PeopleData.Lists[item].MemberId === entry) {
                            //console.log('body:', PeopleData.Lists[item]);
            
                            var tempTeam = {
                                measurement: 'null',
                                name: PeopleData.Lists[item].Name,
                                peopleId: PeopleData.Lists[item].ListId,
                                id: PeopleData.Lists[item].ListId
                            };
                        
                            arrayListId[j] = PeopleData.Lists[item].ListId;

                            db.collection('users').doc(`${entry}`).update({
                                teams: FieldValue.arrayUnion(PeopleData.Lists[item].ListId)
                            }).then(ref => {
                                return ref;
                            }).catch(err => {
                                console.log('Error getting document', err);
                                return err;
                            });

                            return db.collection('teams').doc(`${PeopleData.Lists[item].ListId}`).get()
                            .then(doc => {
                                if (!doc.exists) {
                                    // Add team to firestore if admin
                                    var addTeam = db.collection('teams').doc(`${PeopleData.Lists[item].ListId}`).set(tempTeam).then(ref => {
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
                                return true;
                            })
                            .catch(err => {
                                console.log('Error getting document', err);
                                return err;
                                //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                            })   
                        }
                });
                itemsProcessed++;
                if(itemsProcessed === arrayMemberId.length) {
                    itemsProcessed = 0;
                    setTimeout(function() { callbackAdmin(); }, 5000);
                }
            });

        });
    }

    function callbackAdmin () { 
        // Loop through all admins and create. 
        requiredAdmins.forEach(function(entry) {
            console.log('create.admin: ', `creating admin user with id ${entry}`);
            // **** OBS **** Still on people-VOL!!
            
            // People REST API: GetTeams (Get all teams in people)
            var RestMember = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetMemberDataById/?Id=' + entry + '&ApiKey=';
        
            request(RestMember + keys.RestAPIKey, function (error, response, body) {
                    //console.log('error:', error); // Print the error if one occurred
                    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                    const PeopleData = JSON.parse(body);
                        
                    // Find users that are admins / "Holdleder". If not users is "basis"
                    if (PeopleData.Member.MemberId === entry) {
                        
                        admin.auth().createUser({
                            email: PeopleData.Member.Email,
                            emailVerified: false,
                            password: 'test1234',
                            photoURL: generatePhotoUrl(PeopleData.Member.Email),
                            displayName: PeopleData.Member.Name,
                            disabled: false
                        })
                            .then(function(userRecord) {
                                // See the UserRecord reference doc for the contents of userRecord.
                                console.log('Successfully created new user:', userRecord.uid);

                                var tempUser = {
                                    email: PeopleData.Member.Email,
                                    name: PeopleData.Member.Name,
                                    peopleId: PeopleData.Member.MemberId,
                                    uid: Number(userRecord.uid),
                                    role: 'Admin',
                                    teams: arrayListId
                                };
                                
                                // Add user to firestore if admin
                                var addUser = db.collection('users').doc(`${userRecord.uid}`).set(tempUser).then(ref => {
                                    return ref;
                                }).catch(err => {
                                    console.log('Error getting document', err);
                                    return err;
                                });
                                return true;
                            
                            })
                            .catch(function(error) {
                                console.log('Error creating new user:', error);
                            });                        
                    }
                });
        });

    }
};