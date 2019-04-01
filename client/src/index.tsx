import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import ApolloClient from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from "graphql-tag";
import { ApolloProvider, Query } from "react-apollo";

import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "material-ui-pickers";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const RFMuiTheme = createMuiTheme({
	palette: {
		type: "dark",
		primary: {
			main: "#ee7203" // RF Orange
		}
	},
	typography: {
		useNextVariants: true
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
	uri: "https://us-central1-okoapp-staging.cloudfunctions.net/api/graphql",
	fetchOptions: {
		credentials: "omit"
	},
	typeDefs,
	resolvers: {
		Query: {
		//   isLoggedIn() {
		// 	return false;
		//   },
		  currentUser() {
			  return {
				  teamId: 8812,
				  name: 'Allan'
			  }
		  }
		}
	},
});

/*
client
  .query({
    query: gql`
	{
		users {
			email,
			memberName,
			memberId
		}
	}
    `
  })
  .then(result => console.log(result));
*/

cache.writeData({
	data: {
		isLoggedIn: false
	},
});

const GET_CLIENT_STATE = gql`
	query IsUserLoggedIn {
		isLoggedIn @client
		currentUser @client
	}
`;

ReactDOM.render(
	<ApolloProvider client={client}>
		<MuiThemeProvider theme={RFMuiTheme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<Query query={GET_CLIENT_STATE}>
					{({ loading, error, data }) => {
						console.log('GET_CLIENT_STATE', error, data, loading, client );
						return (<App clientState={data} client={client} />)
					}}
				</Query>
			</MuiPickersUtilsProvider>
		</MuiThemeProvider>
	</ApolloProvider>,
	document.getElementById("root") as HTMLElement
);
registerServiceWorker();
