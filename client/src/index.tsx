import * as React from 'react';
import { render } from 'react-dom';
import { RouterProvider, RouteNode } from 'react-router5';

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import createRouter from './router/create-router';

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
		currentUser: [currentUser]!
	}

	extend type currentUser {
		name: String!
		token: String!
		teamId: string!
	}
`;

const cache = new InMemoryCache();
const client = new ApolloClient({
	cache,
	// Backend API Url from firebase
	uri: 'https://us-central1-okoapp-staging.cloudfunctions.net/api/graphql',
	fetchOptions: {
		credentials: 'omit'
	},
	typeDefs,
	resolvers: {
		Query: {
			//   isLoggedIn() {
			// 	return false;
			//   },
			currentUser() {
				return {
					teamId: 6822,
					name: 'Allan'
				};
			},
			currentTeam() {
				return {
					id: 6822,
					name: 'Allans Pølser'
				};
			}
		}
	}
});

cache.writeData({
	data: {
		isLoggedIn: true // false
	}
});

const GET_CLIENT_STATE = gql`
	query IsUserLoggedIn {
		isLoggedIn @client
		currentUser @client
		currentTeam @client
	}
`;

const router = createRouter();

document.addEventListener('DOMContentLoaded', () =>
	router.start(() =>
		render(
			<ApolloProvider client={client}>
				<RouterProvider router={router}>
					<MuiThemeProvider theme={RFMuiTheme}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Query query={GET_CLIENT_STATE}>
								{({ loading, error, data }) => {
									console.log(
										'GET_CLIENT_STATE',
										error,
										data,
										loading,
										client
									);
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
