import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider } from "react-apollo";

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from 'material-ui-pickers';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const RFMuiTheme = createMuiTheme({
	palette: {
		type: 'dark',
		primary: {
			main: '#ee7203' // RF Orange
		}
	},
	typography: {
		useNextVariants: true,
	},
});

const client = new ApolloClient({
	// Backend API Url from firebase
	uri: "https://us-central1-okoapp-staging.cloudfunctions.net/api/graphql",
	fetchOptions: {
		credentials: 'omit'
	}
});

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

ReactDOM.render(
	<ApolloProvider client={client}>
	    <MuiThemeProvider theme={RFMuiTheme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<App />
			</MuiPickersUtilsProvider>
		</MuiThemeProvider>
	</ApolloProvider>,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();
