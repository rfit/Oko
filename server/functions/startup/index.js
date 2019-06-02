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
const promises1 = [];
const promises2 = [];


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

function createTeamAdmins(body, entry) {

    //console.log("Body", body);
    const PeopleData = JSON.parse(body);
    //console.log("PeopleData", PeopleData);

    // Loop through a whole team
    Object.keys(PeopleData.Members).forEach((item, i) => {
        
        // Find users that are admins / "Holdleder". If not users is "basis"
        if (PeopleData.Members[item].Email === entry) {
            
            arrayMemberId[i] = PeopleData.Members[item].MemberId;
            
            return db.collection('users').doc(`${PeopleData.Members[item].MemberId}`).get()
                .then(doc => {
                    if (!doc.exists) {
                        var newPW = Math.floor((Math.random() * 10000000) + 1).toString();

                        // eslint-disable-next-line promise/no-nesting
                        admin.auth().createUser({
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
                            db.collection('users').doc(`${userRecord.uid}`).set(tempUser).then(ref => {
                                console.log('User added: ', tempUser);
                                return ref;
                            }).catch(err => {
                                console.log('Error getting document', err);
                                return err;
                            });
                            
                            const mailOptions = {
                                from: 'Roskilde Øko App <oeko.app.roskilde.festival@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
                                // REMEMBER TO CHANGE
                                to: "mikael.soerensen@roskilde-festival.dk", //args.email,
                                subject: 'Welcome to Roskilde Øko-app', // email subject
                                html: `<p style="font-size: 16px;">Welcome to Roskilde Øko-App</p>
                                    <br />
                                    <p style="font-size: 14px;">Access the App here using current email: https://okoapp-staging.firebaseapp.com/
                                    <br />
                                    Your password for the Roskilde-festival Øko-app is: ` + newPW + `</p>
                                    <br />
                                    <p style="font-size: 16px;">Best regard, the Øko-app Team.
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
                            
                        })
                        .catch((error) => {
                            //console.log('Error creating new user:', error, PeopleData.Members[item]);
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
        return true; 
    });  
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
                        // eslint-disable-next-line promise/no-nesting
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
}


module.exports = function() {
    const data = require('../data/teams-2019');
    var requiredListOwnerEmail = data.requiredListOwnerEmail;
    var requiredAdmins = data.requiredAdmins;

    console.log(`Starting import of ${requiredListOwnerEmail.length} owners, and ${requiredAdmins.length} admins.`);

    // Loop through all admins and create. 
    requiredListOwnerEmail.forEach((entry) => {
        // People REST API: GetTeams (Get all teams in people)
        var RestMember = 'https://people-pro.roskilde-festival.dk/Api/MemberApi/1/GetMembersByTerm/?term=' + entry + '&ApiKey=';
        promises1.push(request(RestMember + config.HEIMDAL_APIKEY).then((body) => {
            return createTeamAdmins(body, entry);
        })
        .catch((err) => {
            return err;
        }));
    });

    Promise.all(promises1).then((values) => {
        console.log("Done with users");
        return callback();
      }).catch((err)=> {
          return err;
      });

    function callback () { 
        console.log("arrayMemberId", arrayMemberId);
        arrayMemberId.forEach((entry) => {
            // People REST API: GetLists (Get all teams in people)
            var RestTeams = 'https://people-pro.roskilde-festival.dk/Api/Guest/List/1/GetLists/?memberid='+ entry +'&ApiKey=';
            promises2.push(request(RestTeams + config.HEIMDAL_APIKEY).then((body) => { 
                return createTeams(body, entry);
            })
            .catch((err) => {
                return err;
            }));
        });
    }

    Promise.all(promises1.concat(promises2)).then((values) => {
        console.log("Done with teams");
        return callbackAdmin();
      }).catch((err)=> {
        return err;
    });

    function callbackAdmin () { 
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
                                            var addUser = db.collection('users').doc(`${userRecord.uid}`).set(tempUser).then(ref => {
                                                return ref;
                                            }).catch(err => {
                                                console.log('Error getting document', err);
                                                return err;
                                            });
                                            
                                            const mailOptions = {
                                                from: 'Roskilde Øko App <oeko.app.roskilde.festival@gmail.com>', // Something like: Jane Doe <janedoe@gmail.com>
                                                // REMEMBER TO CHANGE
                                                to: "mikael.soerensen@roskilde-festival.dk", //args.email,
                                                subject: 'Welcome to Roskilde Øko-App', // email subject
                                                html: `<p style="font-size: 16px;">Welcome to Roskilde Øko-App</p>
                                                    <br />
                                                    <p style="font-size: 14px;">Access the app here using current email: https://okoapp-staging.firebaseapp.com/
                                                    <br />
                                                    Your password for the Roskilde-festival Øko-app is: ` + newPW + `</p>
                                                    <br />
                                                    <p style="font-size: 16px;">Best regard, the Øko-app Team.
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
};

