function getFirebaseConfig(hostname: string) {
	switch (hostname) {
		case 'oko.roskilde-festival.dk':
		case 'okoapp-production-2019.firebaseapp.com':
			return {
				apiKey: "AIzaSyCS8BF3HM-9myqXmuZWCodFximoJVXHJp8",
				authDomain: "okoapp-production-2019.firebaseapp.com",
				databaseURL: "https://okoapp-production-2019.firebaseio.com",
				projectId: "okoapp-production-2019",
				storageBucket: "okoapp-production-2019.appspot.com",
				messagingSenderId: "673781684692",
				appId: "1:673781684692:web:63e943ddebc5bdcd"
			}
		case 'oko-staging.roskilde-festival.dk':
		case 'okoapp-staging.firebaseapp.com':
		default:
			return {
				apiKey: "AIzaSyCqo4feuGuO8Djm3d4ltS5gC9l48pPz_vw",
				authDomain: "okoapp-staging.firebaseapp.com",
				databaseURL: "https://okoapp-staging.firebaseio.com",
				projectId: "okoapp-staging",
				storageBucket: "okoapp-staging.appspot.com",
				messagingSenderId: "91562819892",
				appId: "1:91562819892:web:6e57f0480cdf275a"
			}
	}
}

export default getFirebaseConfig;
