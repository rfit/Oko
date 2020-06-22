import getEndpoint from './getEndpoint';

describe('getEndpoint', () => {
	it('should get prod API', () => {
		expect( getEndpoint('3000') ).toBe('http://localhost/gql');
	});
    it('should get localhost API', () => {
		expect( getEndpoint('80') ).toBe('/gql');
	});
});
