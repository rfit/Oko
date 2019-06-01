const admin = require('firebase-admin');
const serverTimestamp = require("firebase-admin").firestore.FieldValue.serverTimestamp();
const db = admin.firestore();

const rp = require('request-promise-native');
const config = require('../../config');

const errorHandler = (name) => {
	return (err) => {
		console.error('ERROR', name, err);
		return err;
	}
}

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
				//console.log('Error getting document', err);
				return err;
			})
		},
		currentUser: (root, args, context) => {
			// If we are not logged in, just return null
			if(!context.currentUser) { throw new Error('401 Unauthorized'); }
	
			// console.log('currentUser', context, context.currentUser);
			return db.collection('users').doc(`${context.currentUser.uid}`).get()
				.then(doc => {
					if (!doc.exists) {
						console.log('No such document!');
						return null;
					}

					return doc.data();
				})
				.catch(err => {
					//console.log('Error getting document', err);
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
					let team = doc.data();
					team.id = doc.id;
					teamArray.push(team);
				});
				return teamArray;
			})
			.catch(err => {
				//console.log('Error getting document', err);
				return err;
			})
		},
		team: (parent, args) => {
			return db.collection('teams').doc(`${args.id}`).get()
			.then(doc => {
				if (!doc.exists) {
					console.log('No such document!');
					return null;
				} else {
					//console.log('Team Document data:', doc.data());
					return Object.assign(doc.data(), { id: doc.id })
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
					console.log('allinvoices - No such document!');
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
				//console.log('Error getting document', err);
				return err;
			})
		},
		invoices: (parent, args) => {
			const ref = db.collection('invoices').orderBy('createdDate', 'desc').where('teamId', '==', args.teamId);
			return ref.get()
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
		currentTeam: user => {
			const teamId = user.currentTeam || user.teams[0]

			return db.collection('teams').doc(`${teamId}`).get()
				.then(teamDoc => {
					if (!teamDoc.exists) {
						console.log(`No such document: teams/${teamId}`);
						return null;
					} 

					const teamData = teamDoc.data();
					console.log('Resolved currentTeam to', JSON.stringify(teamData));
					return teamData;
				})
				.catch(err => {
					//console.log('Error getting document', err);
					return err;
				})
		},
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

							let user = doc.data();
							user.id = doc.id;

							userArray.push(user);
						}
					});
				});

				return userArray;
			})
			.catch(err => {
				console.error('Error getting document', err);
				return err;
			})
		},
		invoices: team => {
			console.log(`Getting invoices for ${team.peopleId}`);
			return db.collection('invoices').where('teamId', '==', team.peopleId).get()
			.then(snapshot => {
				if (snapshot.empty) {
					console.log('No invoices for ', team.peopleId);
					return [];
				} 
				
				var invoiceArray = [];
				snapshot.forEach(doc => {
					invoiceArray.push(Object.assign({ id: doc.id }, doc.data()));
				});
				return invoiceArray;
			})
			.catch(err => {
				console.error('Error getting document', err);
				return err;
			})
		},
	},
	
	Mutation: {
		addUser: (parent, args) => {
			//console.log('args.email: ', args.email);
			return db.collection('users').where('email', '==', args.email).get() 
			.then(snapshot => {
				if (snapshot.size === 0) {
					var myURL = `https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetTeamMembers/?teamId=${args.teamId}&ApiKey=${config.HEIMDAL_APIKEY}`;
					
					return rp(myURL)
					.then(function (response) {
						const PeopleData = JSON.parse(response);
						
						Object.keys(PeopleData.TeamMembers).forEach(function (item) {
							// Find users that are admins / "Holdleder". If not users is "basis"
							if (PeopleData.TeamMembers[item].Email === args.email) {
	
								return admin.auth().createUser({
									uid: PeopleData.TeamMembers[item].MemberId.toString(),
									email: PeopleData.TeamMembers[item].Email,
									emailVerified: false,
									password: args.password || 'test1234',
									displayName: PeopleData.TeamMembers[item].MemberName,
									disabled: false
								})
								.then(function(userRecord) {
									// See the UserRecord reference doc for the contents of userRecord.
									console.log('Successfully created new auth user:', userRecord);
			
									var user = {
										id: PeopleData.TeamMembers[item].MemberId,
										uid: PeopleData.TeamMembers[item].MemberId,
										email: PeopleData.TeamMembers[item].Email,
										name: PeopleData.TeamMembers[item].MemberName,
										peopleId: PeopleData.TeamMembers[item].MemberId,
										role: 'Editor',
										teams: [args.teamId]
									};
								
									return addUser = db.collection('users').doc(`${user.id}`).set(user)
										.then(ref => {
											console.log("User Added to collection: ", user);
											return user;
										})
										.catch(err => {
											console.log('Failed adding user', err);
											return err;
										});

								})
								.catch(function(error) {
									console.log('Error creating new user:', error);
								});
							}
						});
						
						console.log('User not found in PeopleData.');

						return admin.auth().createUser({
							// uid: PeopleData.TeamMembers[item].MemberId.toString(),
							email: args.email,
							emailVerified: false,
							password: args.password || 'test1234',
							displayName: '',
							disabled: false
						})
						.then(function(userRecord) {
							// See the UserRecord reference doc for the contents of userRecord.
							console.log('Successfully created new auth user:', userRecord);
	
							var user = {
								id: userRecord.uid,
								uid: userRecord.uid,
								email: args.email,
								name: '',
								peopleId: null,
								role: 'Editor',
								teams: [args.teamId]
							};
						
							return addUser = db.collection('users').doc(`${user.id}`).set(user)
								.then(ref => {
									console.log("User Added to collection: ", user, ref);
									return user;
								})
								.catch(err => {
									console.warn('Failed adding user', err);
									return err;
								});

						})
						.catch(function(error) {
							console.log('Error creating new user:', error);
						});
					})
					.catch(function (err) {
						return err;
					});
				}
				
				return snapshot.docs.forEach(doc => {
					if (doc.exists) {
						const userData = doc.data();
						console.log('User already exists:', userData.email, userData);
						return 'User already exists:', userData.email;
					} 
				})
			}) 
			.catch(err => {
				console.log('Error getting document', err);
				return err;
			})
		},
		removeUser: (parent, args) => {
			return db.collection('users').doc(`${args.id}`).get()
			.then(doc => {
				if (!doc.exists) {
					console.log("User Not Found");
					return false;
				}

				return addUser = db.collection('users').doc(`${args.id}`).delete()
					.then(timestamp => {
						console.log("User Deleted");
						return true;
					})
					.catch(err => {
						console.log('Error removing user', err);
						return true;
					});
			})
			.catch(err => {
				console.log('Error getting document', err);
				return err;
				//throw new Error(`Use addTeams with the following inputs: teamId, teamName, TeamParentId, CopyOfTeamId.`); 
			})
		},
		addInvoice: (parent, args, context) => {
			if(!context.currentUser) { return null; }

			const invoice = {
				invoiceId: args.invoiceId, 
				createdDate: serverTimestamp,
				invoiceDate: args.invoiceDate,
				teamId: args.teamId,
				userId: context.currentUser.uid,
				eco: args.eco,
				nonEco: args.nonEco,
				excluded: args.excluded,
				total: args.eco + args.nonEco + args.excluded
			};

			return addInvoice = db.collection('invoices').add(invoice)
				.then(ref => {
					return db.collection('invoices').doc(`${ref.id}`).get()
					.then(doc => {
						if (!doc.exists) {
							console.log('No such document!');
							return null;
						} else {
							var invoiceArray = [];
							invoiceArray = doc.data();
							invoiceArray.id = ref.id;
							console.log('Invoice Document data:', invoiceArray);
							return invoiceArray;
						}
					})
					.catch(err => {
						return err;
					})
				})
				.catch(err => {
					console.log('Error getting document', err);
					return err;
				});
		},
		updateInvoice: (parent, args, context) => {
			if(!context.currentUser) { return null; }

			const invoiceRef = db.collection('invoices').doc(`${args.id}`);
			return invoiceRef.get()
				.then(doc => {
					if (!doc.exists) {
						console.log("Invoice Not Found");
						return false;
					}

					const invoice = {
						createdDate: serverTimestamp,
						invoiceId: doc.data().invoiceId,
						invoiceDate: doc.data().invoiceDate,
						teamId: doc.data().teamId,
						userId: context.currentUser.uid,
						eco: doc.data().eco,
						nonEco: doc.data().nonEco,
						excluded: doc.data().excluded
					};

					if( args.invoiceId ) { invoice.invoiceId = args.invoiceId; }
					if( args.invoiceDate ) { invoice.invoiceDate = args.invoiceDate; }
					// firebase.firestore.Timestamp.fromDate(new Date(args.invoiceDate)),
					if( args.eco ) {
						invoice.eco = args.eco;
					}
					if( args.nonEco ) {
						invoice.nonEco = args.nonEco;
					}
					if( args.excluded ) {
						invoice.excluded = args.excluded;
					}
					invoice.total = invoice.eco + invoice.nonEco + invoice.excluded;

					console.log(`Updating invoice: ${JSON.stringify(invoice)}`);

					return invoiceRef.update(invoice)
						.then(time => {
							return invoiceRef.get()
								.then(updatedoc => {
									if (!updatedoc.exists) {
										console.log('No such document!');
										return null;
									} 
									var invoiceArray = [];
									invoiceArray = updatedoc.data();
									invoiceArray.id = args.id;
									console.log('Invoice Document data:', invoiceArray);
									return updatedoc.data();
								})
								.catch(err => {
									return err;
								})
				})
				.catch(err => {
					console.log('Error getting document', err);
					return true;
				});
			})
			.catch(err => {
				console.log('Error getting document', err);
				return err; 
			})
		},
		deleteInvoice: (parent, args, context) => {
			if(!context.currentUser) { return null; }

			return db.collection('invoices').doc(`${args.id}`).get()
			.then(doc => {
				if (!doc.exists) {
					console.log("Invoice Not Found");
					return false;
				} else {
					return addUser = db.collection('invoices').doc(`${args.id}`).delete()
					.then(ref => {
						console.log("Invoice Deleted");
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
			})
        },
		setTeamMeasurement: (parent, args, context) => {
			if(!context.currentUser) { return null; }

			const docRef = db.collection('teams').doc(`${args.teamId}`);

			if (args.measurement === 'KG' || args.measurement === 'KR') {
				return docRef.update({
						measurement: args.measurement
					})
					.then(time => {
						console.log(`Measurement Changed for ${args.teamId} to ${args.measurement} by ${context.currentUser.uid}`);

						return docRef.get()
							.then(doc => {
								return doc.data();
							})
							.catch(err => {
								//console.log('Error getting document', err);
								return err;
							})
					})
					.catch(err => {
						console.log('Error getting document', err);
						return true;
					});
			}

			return 'Wrong args.';

		},

		// Set Current Team for user, used if there are more then one team on a user. This allows changing between them.
		setCurrentTeam: (parent, args, context) => {
			if(!context.currentUser) { return null; }
			
			const ref = db.collection('users').doc(`${context.currentUser.uid}`)

			return ref.update({
				currentTeam: args.id
			}).then(() => {
				return ref.get()
					.then(doc => {
						const userData = doc.data();
						userData.id = doc.id;
						console.log('Updated current team:', userData.id, args.id);
						return userData;
					})
					.catch(err => {
						console.log('Error setCurrentTeam', err);
						return err;
					})
			})
 
		},
	},
};
  
module.exports = resolvers;
