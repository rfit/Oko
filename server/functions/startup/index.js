// Firebase Setup

const admin = require('firebase-admin');

var db = admin.firestore();

const keys = require('../serviceAccountKey');
const request = require('request');

const RestTeams = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetTeams/?ApiKey=';

var RestTeamBusBus = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetTeamMembers/?teamId=6822&ApiKey=';

//const Link = 'https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetMembersByTerm/?term=poul&ApiKey=';

var requiredTeamId = [
    6822, // BUSBUS
    6835, // Meyers
    6858, // Folkets Madhus
    7885 // Dava Foods
];    

// Manuel oprettelse af Admins
var requiredAdmins = [ // PeopleIDs
    111100, // Stine Eisen
    1756, // Mikael Langrand Sørensen
    203757 // Allan Kimmer Jensen
];

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
                    //console.log('Added document with ID: ', ref);
                });
            }
        //console.log('body:', PeopleData); // Print the HTML for the Google homepage.
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
                        peopleId: PeopleData.Teams[item].TeamId
                    };
                
                    // Add team to firestore if admin
                    var addTeam = db.collection('teams').doc(`${PeopleData.Teams[item].TeamId}`).set(tempTeam).then(ref => {
                        //console.log('Added document with ID: ', ref);
                    });
                }
        });
        //console.log('body:', PeopleData); // Print the HTML for the Google homepage.
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
        
            // Find users that are admins / "Holdleder". If not users is "basis"
            if (PeopleData.TeamMembers[item].RoleName === 'Holdleder') {
                //console.log('body:', PeopleData.TeamMembers[item]);

                var tempUser = {
                    email: PeopleData.TeamMembers[item].Email,
                    name: PeopleData.TeamMembers[item].MemberName,
                    peopleId: PeopleData.TeamMembers[item].MemberId,
                    role: PeopleData.TeamMembers[item].RoleName,
                    teams: [PeopleData.TeamMembers[item].TeamId]
                };
            
                // Add user to firestore if admin
                var addUser = db.collection('users').doc(`${PeopleData.TeamMembers[item].MemberId}`).set(tempUser).then(ref => {
                    //console.log('Added document with ID: ', ref);
                });

            }
    });
    //console.log('body:', PeopleData); // Print the HTML for the Google homepage.
    });

});

  var userRef = db.collection('users').where('teams', 'array-contains', '6822');
  var getDoc = userRef.get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

    