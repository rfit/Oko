import getEndpoint from './getEndpoint';

describe('getEndpoint', () => {
	it('should get prod API', () => {
		expect( getEndpoint('oko.roskilde-festival.dk') ).toBe('https://europe-west1-okoapp-production-2019.cloudfunctions.net/api');
		expect( getEndpoint('okoapp-production-2019.firebaseapp.com') ).toBe('https://europe-west1-okoapp-production-2019.cloudfunctions.net/api');
	});
    it('should get localhost API', () => {
		expect( getEndpoint('localhost') ).toBe('http://localhost:8080/gql');
	});
});
