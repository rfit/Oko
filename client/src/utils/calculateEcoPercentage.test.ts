import calculateEcoPercentage from './calculateEcoPercentage';

describe('calculateEcoPercentage', () => {
    it('should calulate percentage corrently', () => {
		expect( calculateEcoPercentage(90, 10, 10) ).toBe(90);
		expect( calculateEcoPercentage(0, 0, 300) ).toBe(100);
	});
});
