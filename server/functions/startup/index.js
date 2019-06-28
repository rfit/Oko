// Firebase Setup
const admin = require('firebase-admin');
var db = admin.firestore();
var FieldValue = require("firebase-admin").firestore.FieldValue;

const config = require('../config');
const request = require('request-promise-native');
const nodemailer = require('nodemailer');

const ROLE_SUPERADMIN = "SUPERADMIN";
const ROLE_ADMIN = "ADMIN";

var arrayListId = [];
var arrayMemberId = [];
const promisesAdmins = [];
const promisesTeams = [];
const promiseGetAdminData = [];
const promiseUpdateTeam = [];
const promiseCheckTeam = [];

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.GMAIL_USER,
        pass: config.GMAIL_PASSWORD
    }
});

function generatePhotoUrl(email) {
    var crypto = require('crypto');
    const hash = crypto.createHash('md5').update(email).digest("hex");
    return 'https://www.gravatar.com/avatar/' + hash;
}

function sendGmail(email, newPW) {

    const mailOptions = {
        from: 'Roskilde Øko App <oeko.app.roskilde.festival@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
        // REMEMBER TO CHANGE
        to: email,
        subject: 'Welcome to Roskilde Festival Øko-App (Organic-App)', // email subject
        html: `<p style="font-size: 16px;">Welcome to Roskilde Festival Øko-App (Organic-App)</p>
            <br />
            <p style="font-size: 14px;">Access the Web-App here using your current email: https://oko.roskilde-festival.dk/
            <br />
            Your password for the Roskilde Festival Øko-App is: ` + newPW + `</p>
            <br />
            <p style="font-size: 14px;">Guide for the app can be found in People shared files.</p>
            <br />
            <p style="font-size: 16px;">Best regards, the Øko-App Team.
            <br />
            Enjoy the music!</p>
            <br />
            <img src="http://presscloud.com/file/51/512482838474559/RF19-Poster-31-01-2019.png" />
        ` // email content in HTML
    };

    // returning result
    return transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            return error.toString();
        }
        console.log("Sended ...");
        return "Sended ...";
    });

}

function addFirestoreUser(uid, userinfo) {

    db.collection('users').doc(`${uid}`).set(userinfo).then(ref => {
        console.log('User added: ', userinfo);
        return ref;
    }).catch(err => {
        console.log('Error getting document', err);
        return err;
    });

}

function createAdmins(body, entry) {

    const PeopleData = JSON.parse(body);
    //console.log("Body", body);
    //console.log("entry: ", entry);

    // Loop through a whole team
    Object.keys(PeopleData.Members).forEach((item, i) => {
        
        // Find users that are admins / "Holdleder". If not users is "basis"
        if (PeopleData.Members[item].Email === entry) {
            
            arrayMemberId.push(PeopleData.Members[item].MemberId);
            
            promiseGetAdminData.push(
                db.collection('users').where('peopleId', '==', PeopleData.Members[item].MemberId).get()
                .then(snapshot => {
                    if (snapshot.size === 0) {    
                
                            var newPW = Math.floor((Math.random() * 10000000) + 1).toString();

                            // eslint-disable-next-line promise/no-nesting
                            promiseGetAdminData.push(admin.auth().createUser({
                                email: PeopleData.Members[item].Email.trim(),
                                emailVerified: false,
                                password: newPW,
                                photoURL: generatePhotoUrl(PeopleData.Members[item].Email.trim()),
                                displayName: PeopleData.Members[item].Name,
                                disabled: false
                            })
                            .then((userRecord) => {
                                // See the UserRecord reference doc for the contents of userRecord.
                                console.log('Successfully created new user:', userRecord.uid);

                                var tempUser = {
                                    email: userRecord.email,
                                    name: userRecord.displayName,
                                    peopleId: PeopleData.Members[item].MemberId,
                                    role: ROLE_ADMIN,
                                    teams: []
                                    //,
                                    //teams: [PeopleData.Members[item].TeamMemberships[0].TeamId]
                                };
                                
                                // Add user to firestore if admin
                                // eslint-disable-next-line promise/no-nesting
                                
                                promiseGetAdminData.push(addFirestoreUser(userRecord.uid, tempUser));
                                
                                // Change for go-live
                                return sendGmail(PeopleData.Members[item].Email.trim(), newPW);
                                //return sendGmail('mikael.soerensen@roskilde-festival.dk', newPW);
                                
                            })
                            .catch((error) => {
                                //console.log('Error creating new user:', error, PeopleData.Members[item]);
                            }));

                    } else {
                        console.log('User already exists: ', PeopleData.Members[item].Email);
                        return true;
                    }
                    return true;
                })
                .catch(err => {
                    console.log('Error getting document', err);
                    return err;
                    //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                })
            );
        }
    });  
    // eslint-disable-next-line promise/catch-or-return
    return Promise.all(promiseGetAdminData);
    
}

function createTeams(body, entry) {
    
    const PeopleData = JSON.parse(body);

    // Loop through a whole team
    Object.keys(PeopleData.Lists).forEach((item, j) => {
        
            // Find team based on TeamId
            if (PeopleData.Lists[item].MemberId === entry) {
                //console.log('body:', PeopleData.Lists[item]);

                var tempTeam = {
                    measurement: 'null',
                    name: PeopleData.Lists[item].Name,
                    peopleId: PeopleData.Lists[item].ListId
                };
            
                arrayListId.push(PeopleData.Lists[item].ListId);
                
                promiseUpdateTeam.push(db.collection('users').where('peopleId', '==', entry).get()
                // eslint-disable-next-line promise/always-return
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        //console.log(doc.id, " => ", doc.data());
                        // Build doc ref from doc.id
                        db.collection("users").doc(doc.id).update({teams: FieldValue.arrayUnion(PeopleData.Lists[item].ListId)});
                    });
                }).catch(err => {
                    console.log('Error getting document', err);
                    return err;
                }));

                promiseCheckTeam.push(db.collection('teams').doc(`${PeopleData.Lists[item].ListId}`).get()
                .then(doc => {
                    if (!doc.exists) {
                        // Add team to firestore if admin
                        // eslint-disable-next-line promise/no-nesting
                        var addTeam = db.collection('teams').doc(`${PeopleData.Lists[item].ListId}`).set(tempTeam).then(ref => {
                            console.log('Team do not exists: ', tempTeam);
                            return ref;
                        }).catch(err => {
                            console.log('Error getting document', err);
                            return err;
                        });
                        
                    } else {
                        console.log("Team already exists: ", doc.data().name);
                        return doc.data();
                    }
                    return true;
                })
                .catch(err => {
                    console.log('Error getting document', err);
                    return err;
                    //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                }))   
            }
    });

    return Promise.all(promiseUpdateTeam,promiseCheckTeam);

}

function callbackAdmin (requiredAdmins) { 
    // Loop through all admins and create. 
    requiredAdmins.forEach((entry) => {
        
        // **** OBS **** Still on people-VOL!!
        var addSuperAdmin = db.collection('users').where('peopleId', '==', entry).get()
        .then(snapshot => {
            if (snapshot.size === 0) {    
       
                    console.log('create.admin: ', `creating admin user with id ${entry}`);
                    // People REST API: GetTeams (Get all teams in people)
                    var RestMember = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetMemberDataById/?Id=' + entry + '&ApiKey=';
                
                    // eslint-disable-next-line promise/no-nesting
                    request(RestMember + process.env.HEIMDAL_PEOPLE_APIKEY).then( (body) => {
                            //console.log('error:', error); // Print the error if one occurred
                            //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                            const PeopleData = JSON.parse(body);
                                
                            // Find users that are admins / "Holdleder". If not users is "basis"
                            // eslint-disable-next-line promise/always-return
                            if (PeopleData.Member.MemberId === entry) {
                                var newPW = Math.floor((Math.random() * 10000000) + 1).toString();

                                // eslint-disable-next-line promise/no-nesting
                                admin.auth().createUser({
                                    email: PeopleData.Member.Email,
                                    emailVerified: false,
                                    password: newPW,
                                    photoURL: generatePhotoUrl(PeopleData.Member.Email),
                                    displayName: PeopleData.Member.Name,
                                    disabled: false
                                })
                                    .then((userRecord) => {
                                        // See the UserRecord reference doc for the contents of userRecord.
                                        console.log('Successfully created new user:', userRecord.uid);

                                        var tempUser = {
                                            email: PeopleData.Member.Email,
                                            name: PeopleData.Member.Name,
                                            peopleId: PeopleData.Member.MemberId,
                                            role: ROLE_SUPERADMIN,
                                            teams: arrayListId
                                        };
                                        
                                        // Add user to firestore if admin
                                        // eslint-disable-next-line promise/no-nesting
                                        
                                        var addUser = addFirestoreUser(userRecord.uid, tempUser);

                                        // Change for go-live
                                        return sendGmail(PeopleData.Member.Email.trim(), newPW);
                                        //return sendGmail('mikael.soerensen@roskilde-festival.dk', newPW);
                                    
                                    })
                                    .catch((error) => {
                                        //console.log('Error creating new user:', error);
                                    });                        
                            }
                        })
                        .catch((err) => {
                            return err;
                        });

                    } else {
                        console.log('Super Admin User already exists with people-vol id: ', entry);
                        //return doc.data();
                        return false;
                    }
                    return true;
                })
                .catch(err => {
                    console.log('Error getting document', err);
                    return err;
                    //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
                })
    });

}

function callbackAdminExternal (requiredAdminsExternal) { 

    // Loop through all admins and create. 
    requiredAdminsExternal.forEach((entry) => {
    

        var addSuperAdmin = db.collection('users').where('email', '==', entry).get()
        .then(snapshot => {
            if (snapshot.size === 0) {    
       
                console.log('create.admin: ', `creating admin user with email: ${entry}`);
                var newPW = Math.floor((Math.random() * 10000000) + 1).toString();

                // eslint-disable-next-line promise/no-nesting
                admin.auth().createUser({
                    email: entry,
                    emailVerified: false,
                    password: newPW,
                    photoURL: generatePhotoUrl(entry),
                    displayName: entry,
                    disabled: false
                })
                    .then((userRecord) => {
                        // See the UserRecord reference doc for the contents of userRecord.
                        console.log('Successfully created new user:', userRecord.uid);

                        var tempUser = {
                            email: entry,
                            name: entry,
                            peopleId: '',
                            role: ROLE_SUPERADMIN,
                            teams: arrayListId
                        };
                        
                        // Add user to firestore if admin
                        // eslint-disable-next-line promise/no-nesting
                        
                        var addUser = addFirestoreUser(userRecord.uid, tempUser);

                        // Change for go-live
                        return sendGmail(PeopleData.Member.Email.trim(), newPW);
                        //return sendGmail('mikael.soerensen@roskilde-festival.dk', newPW);
                    
                    })
                    .catch((error) => {
                        //console.log('Error creating new user:', error);
                    });  

            } else {
                console.log('Super Admin User already exists with email id: ', entry);
                //return doc.data();
                return false;
            }
            return true;
        })
        .catch(err => {
            console.log('Error getting document', err);
            return err;
            //throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
        })


    });
}

module.exports = function() {
    const data = require('../data/teams-2019');
    var requiredListOwnerEmail = data.requiredListOwnerEmail;
    var requiredAdmins = data.requiredAdmins;
    var requiredAdminsExternal = data.requiredAdminsExternal;

    console.log(`Starting import of ${requiredListOwnerEmail.length} owners, ${requiredAdmins.length} admins internal and ${requiredAdminsExternal.length} admins external.`);

    // Loop through all admins and create. 
    requiredListOwnerEmail.forEach((entry) => {
        // People REST API: GetTeams (Get all teams in people)
        var RestMember = 'https://people-pro.roskilde-festival.dk/Api/MemberApi/1/GetMembersByTerm/?term=' + entry + '&ApiKey=';
        promisesAdmins.push(request(RestMember + config.HEIMDAL_APIKEY).then((body) => {
               return createAdmins(body, entry)
        })
        .catch((err) => {
            return err;
        }));
    });

    // eslint-disable-next-line promise/always-return
    Promise.all(promisesAdmins).then((values) => {
        setTimeout(() => { 
            console.log("waited for 15 sec..."); 
        
            console.log("Done with users. Array Len: ", arrayMemberId.length );
            
            arrayMemberId.forEach((entry) => {
                // People REST API: GetLists (Get all teams in people)
                var RestTeams = 'https://people-pro.roskilde-festival.dk/Api/Guest/List/1/GetLists/?memberid='+ entry +'&ApiKey=';
                // eslint-disable-next-line promise/no-nesting
                promisesTeams.push(request(RestTeams + config.HEIMDAL_APIKEY).then((body) => { 
                    return createTeams(body, entry);
                })
                .catch((err) => {
                    return err;
                }));
            });
        
            // eslint-disable-next-line promise/no-nesting
            Promise.all(promisesTeams).then((values) => {
                console.log("Done with Admins and Teams.. Team len: ", arrayListId.length, " Starting Admin Internal ...");
                return callbackAdmin(requiredAdmins);
            }).catch((err)=> {
                return err;
            });

            // eslint-disable-next-line promise/no-nesting
            Promise.all(promisesTeams).then((values) => {
                console.log("Done with Admins and Teams.. Team len: ", arrayListId.length, " Starting Admin External ...");
                return callbackAdminExternal(requiredAdminsExternal);
            }).catch((err)=> {
                return err;
            });


        }, 15000);

      }).catch((err)=> {
          return err;
      }); 
    
};

