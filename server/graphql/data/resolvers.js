const { AuthenticationError } = require("apollo-server-express");
const rp = require('request-promise-native');
const config = require('../../config');

const { User, Team, Invoice } = require('./schema');

const errorHandler = (err) => {
	console.log('Error getting document', err);
	return err;
};

const resolvers = {
	Query: {
		users: () => {
			return User.find({})
				.then(users => {
					if (users.length === 0) {
						console.log('No such document!');
						return null;
					} 
					
					return users;
			})
			.catch(errorHandler);
		},
		user: (parent, args) => {
			return User.findById(args.id)
			.then(user => {
				if (!user) {
					console.log('No such user!');
					return null;
				}
				return user;
				
			})
			.catch(errorHandler);
		},
		currentUser: (root, args, context) => {
			// If we are not logged in, just return null
			if(!context.currentUser) { throw new AuthenticationError('must authenticate'); }
	
			// console.log('currentUser', context, context.currentUser);
			return User.findById(context.currentUser.uid)
				.then(user => {
					if (!user) {
						console.log('No such user!');
						return null;
					}

					return user;
				})
				.catch(errorHandler);
		},
		teams: () => {
			return Team.find({}).sort('name asc')
			.then(users => {
				if (users.length === 0) {
					console.log('No such document!');
					return [];
				} 
			
				return users;
			})
			.catch(errorHandler);
		},
		team: (parent, args) => {
			return Team.findById(args.id)
			.then(team => {
				if (!team) {
					console.log('No such document!');
					return null;
				}
				return team;
			})
			.catch(errorHandler);
		},
		allinvoices: () => {
			return Invoice.find({})
			.then(invoices => {
				if (invoices.length === 0) {
					console.log('allinvoices - No such document!');
					return [];
				} 
				
				return invoices;
			})
			.catch(errorHandler);
		},
		invoices: (parent, args) => {
			return Invoice.find({ teamId: args.teamId }).sort('createdDate desc')
				.then(invoices => {
					if (invoices.length === 0) {
						console.log('No such document!');
						return [];
					}

					return invoices;
				})
				.catch(errorHandler);
		},
		invoice: (parent, args) => {
			return Invoice.findById(args.id)
			.then(invoice => {
				if (!invoice) {
					console.log('No such invoice!');
					return null;
				}

				return invoice;
			})
			.catch(errorHandler);
		},
	},
	User: {
		currentTeam: user => {
			const teamId = user.currentTeam || user.teams[0];

			return Team.findById(teamId)
				.then(teamDoc => {
					if (!teamDoc) {
						console.log(`No such document: teams/${teamId}`);
						return null;
					} 

					return teamDoc;
				})
				.catch(errorHandler);
		},
		//Eksempel på custom felter, udfra de eksisterende
		teams: user => {
			return Team.find({}).sort('name asc')
			.then(teams => {
				if (teams.length === 0) {
					console.log('No such document!');
					return [];
				} 
				
				let teamArray = [];
				teams.forEach(team => {
					user.teams.forEach(existingTeam => {
						if( team.peopleId === existingTeam ) {
							teamArray.push(team);
						}
					});

				}); 
				return teamArray;
			})
			.catch(errorHandler);
		},
		invoices: user => {
			return Invoice.find({})
			.then(invoices => {
				if (invoices.length === 0) {
					console.log('No such document!');
					return [];
				} 
				
				let teamArray = [];
				invoices.forEach(invoice => {
					user.teams.forEach(team => {
						if( invoice.teamId === team ) {
							teamArray.push(invoice);
						}
					});
				}); 
				return teamArray;
			})
			.catch(errorHandler);
		},
	  },
	  Team: {
		users: team => {
			return User.find({})
			.then(users => {
				if (users.length === 0) {
					console.log('No such document!');
					return [];
				} 
				
				let userArray = [];
				users.forEach(user => {
					user.teams.forEach(id => {
						// Not all ID's are string, some are numbers, here we double check them.
						if( String(id) === String(team.id) ) {
							userArray.push({ id: user.id });
						}
					});
				});

				return userArray;
			})
			.catch(errorHandler);
		},
		invoices: team => {
			console.log(`Getting invoices for ${team.id}`);
			return Invoice.find({ teamId: team.id })
			.then(invoices => {
				if (invoices.length === 0) {
					console.log('No invoices for ', team.id);
					return [];
				} 
				
				return invoices;
			})
			.catch(errorHandler);
		},
	},
	
	Mutation: {
		addUser: (parent, args) => {
			//console.log('args.email: ', args.email);
			return User.find({ email: args.email })
			.then(docs => {
				if (docs.length === 0) {
					let myURL = `https://people-vol.roskilde-festival.dk/Api/MemberApi/1/GetTeamMembers/?teamId=${args.teamId}&ApiKey=${config.HEIMDAL_APIKEY}`;
					
					return rp(myURL)
					.then((response) => {
						const PeopleData = JSON.parse(response);
						
						Object.keys(PeopleData.TeamMembers).forEach((item) => {
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
								.then((userRecord) => {
									// See the UserRecord reference doc for the contents of userRecord.
									console.log('Successfully created new auth user:', userRecord);
			
									let user = {
										_id: PeopleData.TeamMembers[item].MemberId,
										uid: PeopleData.TeamMembers[item].MemberId,
										email: PeopleData.TeamMembers[item].Email,
										name: PeopleData.TeamMembers[item].MemberName,
										peopleId: PeopleData.TeamMembers[item].MemberId,
										role: 'Editor',
										teams: [args.teamId]
									};

									return User.create(user)
										.then(ref => {
											console.log("User Added to collection: ", user);
											return user;
										})
										.catch(err => {
											console.log('Failed adding user', err);
											return err;
										});

								})
								.catch((error) => {
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
						.then((userRecord) => {
							// See the UserRecord reference doc for the contents of userRecord.
							console.log('Successfully created new auth user:', userRecord);
	
							let user = {
								_id: userRecord.uid,
								uid: userRecord.uid,
								email: args.email,
								name: '',
								peopleId: null,
								role: 'EDITOR',
								teams: [args.teamId]
							};
						
							return User.create(user)
								.then(ref => {
									console.log("User Added to collection: ", user, ref);
									return user;
								})
								.catch(err => {
									console.warn('Failed adding user', err);
									return err;
								});

						})
						.catch((error) => {
							console.log('Error creating new user:', error);
						});
					})
					.catch(errorHandler);
				}
				
				return docs.forEach(doc => {
					console.log('User already exists:', doc.email, doc);
					return 'User already exists:' + doc.email;
				});
			}) 
			.catch(err => {
				console.log('Error getting document', err);
				return err;
			});
		},
		removeUser: (parent, args) => {
			return User.findById(args.id)
			.then(doc => {
				if (!doc) {
					console.log("User Not Found");
					return false;
				}

				return User.findById(args.id).remove()
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
			});
		},
		addInvoice: (parent, args, context) => {
			if(!context.currentUser) { return null; }

			if ( args.excluded === null ) {
				args.excluded = 0;
			}

			const invoice = {
				invoiceId: args.invoiceId, 
				createdDate: serverTimestamp,
				invoiceDate: args.invoiceDate,
				supplier: args.supplier,
				teamId: args.teamId,
				userId: context.currentUser.uid,
				eco: args.eco,
				nonEco: args.nonEco,
				excluded: args.excluded,
				total: args.eco + args.nonEco + args.excluded
			};

			return Invoice.create(invoice)
				.then(ref => {
					// eslint-disable-next-line promise/no-nesting
					return Invoice.findById(ref.id)
					.then(doc => {
						if (!doc) {
							console.log('No such document!');
							return null;
						} else {
							console.log('Invoice Document data:', doc);
							return doc;
						}
					})
					.catch(errorHandler);
				})
				.catch(err => {
					console.log('Error getting document', err);
					return err;
				});
		},
		updateInvoice: (parent, args, context) => {
			if(!context.currentUser) { return null; }

			return Invoice.findById(args.id)
				.then(doc => {
					if (!doc) {
						console.log("Invoice Not Found");
						return false;
					}

					const invoice = {
						_id: args.id,
						createdDate: serverTimestamp,
						invoiceId: doc.invoiceId,
						invoiceDate: doc.invoiceDate,
						teamId: doc.teamId,
						userId: context.currentUser.uid,
						eco: doc.eco,
						nonEco: doc.nonEco,
						excluded: doc.excluded,
						supplier: doc.supplier
					};

					if( args.invoiceId ) { invoice.invoiceId = args.invoiceId; }
					if( args.invoiceDate ) { invoice.invoiceDate = args.invoiceDate; }
					if( args.supplier ) { invoice.supplier = args.supplier; }
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

					return Invoice.update(invoice)
						.then(() => {
							return Invoice.findById(args.id)
								.then(updatedoc => {
									if (!updatedoc) {
										console.log('No such document!');
										return null;
									}
									console.log('Invoice Document data:', updatedoc);
									return updatedoc;
								})
								.catch(err => {
									return err;
								});
				})
				.catch(err => {
					console.log('Error getting document', err);
					return true;
				});
			})
			.catch(err => {
				console.log('Error getting document', err);
				return err; 
			});
		},
		deleteInvoice: (parent, args, context) => {
			if(!context.currentUser) { return null; }

			return Invoice.findById(args.id)
			.then(doc => {
				if (!doc) {
					console.log("Invoice Not Found");
					return false;
				} else {
					return Invoice.findOneAndDelete(args.id)
					.then(() => {
						console.log("Invoice Deleted");
						return true;
					})
					.catch(errorHandler);
				}
			})
			.catch(err => {
				console.log('Error getting document', err);
				return err; 
			});
        },
		setTeamMeasurement: (parent, args, context) => {
			if(!context.currentUser) { throw new Error('401 Unauthorized'); }

			if (args.measurement === 'KG' || args.measurement === 'KR') {
				return Team.findOneAndUpdate({ _id: args.id }, {
						measurement: args.measurement
					})
					.then(time => {
						console.log(`Measurement Changed for ${args.teamId} to ${args.measurement} by ${context.currentUser.uid}`);

						return Team.findById(args.id)
							.catch(errorHandler);
					})
					.catch(err => {
						console.log('Error getting document', err);
						return true;
					});
			}

			return 'Wrong args.';

		},

		setNotes: (parent, args, context) => {
			if(!context.currentUser) { throw new Error('401 Unauthorized'); }

			return Team.findOneAndUpdate({ _id: args.teamId }, {
					notes: args.notes
				})
				.then(time => {
					console.log(`Note set for ${args.teamId} to ${args.notes} by ${context.currentUser.uid}`);

					return Team.findById(args.id)
						.catch(errorHandler);
				})
				.catch(errorHandler);
		},

		// Set Current Team for user, used if there are more then one team on a user. This allows changing between them.
		setCurrentTeam: (parent, args, context) => {
			if(!context.currentUser) { throw new Error('401 Unauthorized'); }
			
			return User.findOneAndUpdate({ _id: context.currentUser.uid },{
				currentTeam: args.id
			}).then(() => {
				return User.findById(context.currentUser.uid).get()
					.then(doc => {
						console.log('Updated current team:', doc, args.id);
						return doc;
					})
					.catch(err => {
						console.log('Error setCurrentTeam', err);
						return err;
					});
			});
 
		},
	},
};
  
module.exports = resolvers;
