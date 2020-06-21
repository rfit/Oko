function getEndpoint(hostname: string) {
	switch (hostname) {
		default:
			return 'http://localhost:8080/gql';
	}
	// switch (hostname) {
	// 	case 'oko.roskilde-festival.dk':
	// 	case 'okoapp-production-2019.firebaseapp.com':
	// 		return 'https://europe-west1-okoapp-production-2019.cloudfunctions.net/api';
	// 	case 'oko-staging.roskilde-festival.dk':
	// 	case 'okoapp-staging.firebaseapp.com':
	// 		return 'https://europe-west1-okoapp-staging.cloudfunctions.net/api';
	// 	default:
	// 		return 'http://localhost:5000/okoapp-staging/europe-west1/api'
	// }
}

export default getEndpoint;
