import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
	uri: "https://us-central1-okoapp-staging.cloudfunctions.net/api/graphql"
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
		<App />
	</ApolloProvider>,
	document.getElementById('root') as HTMLElement
);
registerServiceWorker();
