function getEndpoint(port: string) {
	// If the port is 3000 we assume that we are running the dev verison and need to called the docker on localhost.
	switch (port) {
		case '3000':
			return 'http://localhost/gql';
		default:
			return '/gql';
	}
}

export default getEndpoint;
