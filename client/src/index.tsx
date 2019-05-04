import * as React from 'react';
import { render } from 'react-dom';
import { RouterProvider, RouteNode } from 'react-router5';

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
import DateFnsUtils from '@date-io/date-fns';
import daLocale from "date-fns/locale/en-US";

import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import createRouter from './router/create-router';

import firebase from 'firebase';

const localeMap = {
	da: daLocale
  };

// Initialize Firebase
const config = {
	apiKey: "AIzaSyCqo4feuGuO8Djm3d4ltS5gC9l48pPz_vw",
	authDomain: "okoapp-staging.firebaseapp.com",
	databaseURL: "https://okoapp-staging.firebaseio.com",
	projectId: "okoapp-staging",
	storageBucket: "okoapp-staging.appspot.com",
	messagingSenderId: "91562819892"
};
firebase.initializeApp(config);

const RFMuiTheme = createMuiTheme({
	palette: {
		primary: {
			main: '#ee7203' // RF Orange
		}
	},
	typography: {
		useNextVariants: true
	},
	shape: {
		borderRadius: 8
	},
	overrides: {
		MuiDrawer: {
			paper: {
				backgroundColor: '#18202c'
			}
		},
		MuiDivider: {
			root: {
				backgroundColor: '#404854'
			}
		},
		MuiListItemText: {
			primary: {
				fontWeight: 500
			}
		},
		MuiListItemIcon: {
			root: {
				color: 'inherit',
				marginRight: 0,
				'& svg': {
					fontSize: 20
				}
			}
		}
	}
});

const typeDefs = gql`
	extend type Query {
		isLoggedIn: Boolean!
		currentTeam: Team!
	}
	extend type Mutation {
		setCurrentTeam(uid: String!): Team!
	}
`;

const GET_CURRENT_USER = gql`
	query GetCurrentUser {
		currentTeam @client {
			id,
			name
		},
		currentUser {
			name,
			uid,
			teams {
				measurement,
				id,
				name
			}
		}
	}
`;

const client = new ApolloClient({
	// Backend API Url from firebase
	uri: 'https://europe-west1-okoapp-staging.cloudfunctions.net/api/graphql',
	fetchOptions: {
		credentials: 'omit'
	},
	headers: {
		authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : "",
	},
	typeDefs,
	resolvers: {
		Query: {
			isLoggedIn() {
				return !!localStorage.getItem('token');
			},

			currentTeam: (obj, args, context, info) => {
				// const data = context.cache.readQuery({ query: GET_CURRENT_USER });
				console.log('currentTeamQuery', obj.currentUser.teams[0], obj, args);
				return {
					...obj.currentUser.teams[0],
					name: obj.currentUser.teams[0].name,
					id: parseInt(obj.currentUser.teams[0].id, 10)
				}

				// {
				// 	id: 6822,
				// 	name: 'Allans Pølser'
				// };
			}
		},
		Mutation: {
			changeTeam: () => {
				console.log('change team');
			},
			// setCurrentUser: (_, { displayName, uid }, { cache }) => {
			// 	const user = client.query({ query: GET_USER_WITH_TEAMS, variables: { uid } });
			// 	console.log('CURRENT USER: User login mutation resolver', displayName, uid, user);
			// 	const data = {
			// 		isLoggedIn: true,
			// 		currentUser: {
			// 			__typename: 'User',
			// 			uid,
			// 			displayName
			// 		}
			// 	};
			// 	cache.writeData({ data });
			// 	return true;
			// },
			// logoutUser: () => {
			// 	console.log('User logout');
			// }
		},
	}
});

client.cache.writeData({
	data: {
		isLoggedIn: !!localStorage.getItem('token'), // false,
	}
});

firebase.auth().onAuthStateChanged((user) => {
	if (user) {

		user.getIdToken().then((token) => {
			localStorage.setItem('token', token);
		});

		client.cache.writeData({
			data: {
				isLoggedIn: true // false
			}
		});

		/*

		{
					mutation LoginUser(
							$uid: String!,
							$displayName: String!
						) {
							setCurrentUser(uid: $type,  displayName: $displayName) @client {
						}
				  	}
				}
		*/
		// client
		// 	.mutate({
		// 		mutation: gql`
		// 			mutation SetCurrentUser($uid: String!, $displayName: String!){
		// 				setCurrentUser(uid: $uid, displayName: $displayName) @client
		// 			}
		// 		`,
		// 		variables: {
		// 			uid: user.uid,
		// 			displayName: user.displayName
		// 		}
		// 	})
		// 	.then(result => {
		// 		console.log('firebase: login query result', result, user);
		// 		console.log('firebase: user logged in!', user.uid, user.displayName);

		// 		/*client.cache.writeData({
		// 			data: {
		// 				isLoggedIn: true // false
		// 			}
		// 		});*/
		// 	});


		// User is signed in.
		//   var displayName = user.displayName;
		//   var email = user.email;
		//   var emailVerified = user.emailVerified;
		//   var photoURL = user.photoURL;
		//   var isAnonymous = user.isAnonymous;
		//   var uid = user.uid;
		//   var providerData = user.providerData;
		// ...
	} else {
		console.log('User signed out.');
		localStorage.setItem('token', '')
		// User is signed out.
		// ...
	}
});

const GET_CLIENT_STATE = gql`
	query IsUserLoggedIn {
		isLoggedIn @client
	}
`;

const router = createRouter();

document.addEventListener('DOMContentLoaded', () =>
	router.start(() =>
		render(
			<ApolloProvider client={client}>
				<RouterProvider router={router}>
					<MuiThemeProvider theme={RFMuiTheme}>
						<MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap.da}>
							<Query query={GET_CLIENT_STATE}>
								{({ loading, error, data }:any) => {
									console.log(
										'GET_CLIENT_STATE',
										error,
										data,
										loading,
										client
									);

									if(loading) { return <p>Loading app..</p>; }

									console.log('APP-DATA', data);
									return (
										<RouteNode nodeName="">
											{({ route }) => <App route={route} clientState={data} client={client} />}
										</RouteNode>
									)
								}}
							</Query>
						</MuiPickersUtilsProvider>
					</MuiThemeProvider>
				</RouterProvider>
			</ApolloProvider>,
			document.getElementById('root') as HTMLElement
		)
	)
)

registerServiceWorker();
