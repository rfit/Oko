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
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';
import getEndpoint from './utils/getEndpoint';
import getFirebaseConfig from './utils/getFirebaseConfig';

import * as firebase from "firebase/app";
import "firebase/performance";

const localeMap = {
	da: daLocale
};

// Initialize Firebase
firebase.initializeApp(getFirebaseConfig(location.hostname));

// Initialize Performance Monitoring and get a reference to the service
firebase.performance();

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
		changeTeam(id: String!): Team!
	}
`;


const client = new ApolloClient({
	// Backend API Url from firebase
	uri: getEndpoint(location.hostname),
	fetchOptions: {
		credentials: 'omit'
	},
	request: async (operation) => {
		operation.setContext({
		  headers: {
			authorization: localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ""
		  }
		});
	},
	typeDefs,
	resolvers: {
		Query: {
			isLoggedIn() {
				return !!localStorage.getItem('token');
			}
		}
	}
});

const authPromise = new Promise((resolve, reject) => {
	firebase.auth().onIdTokenChanged((user) => {
		console.debug('running token check', user)
		if (user) {
			user.getIdToken().then((token) => {
				console.log('Setting new token');

				localStorage.setItem('token', token);

				client.cache.writeData({
					data: {
						isLoggedIn: true
					}
				});

				resolve(token);
			});
		} else {
			console.log('User signed out.');
			localStorage.setItem('token', '');
			client.cache.writeData({
				data: {
					isLoggedIn: false
				}
			});

			resolve(false);
		}
	});
});

const GET_CLIENT_STATE = gql`
	query IsUserLoggedIn {
		isLoggedIn @client(always: true)
	}
`;

const router = createRouter();

document.addEventListener('DOMContentLoaded', () =>
	authPromise.then(() => {
		router.start(() =>
			render(
				<ErrorBoundary>
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

											if(loading) { return <Loading />; }

											return (
												<RouteNode nodeName="">
													{({ route }) => <App route={route} router={router} clientState={data} client={client} />}
												</RouteNode>
											)
										}}
									</Query>
								</MuiPickersUtilsProvider>
							</MuiThemeProvider>
						</RouterProvider>
					</ApolloProvider>
				</ErrorBoundary>,
				document.getElementById('root') as HTMLElement
			)
		)
	})
)

registerServiceWorker();
