import calculateEcoPercentage from './calculateEcoPercentage';

describe('calculateEcoPercentage', () => {
    it('should calulate percentage corrently', () => {
		expect( calculateEcoPercentage(100, 0, 0) ).toBe(100);
		expect( calculateEcoPercentage(100, 200, 0) ).toEqual(33.33333333333333);
		expect( calculateEcoPercentage(0, 100, 0) ).toBe(0);
		expect( calculateEcoPercentage(0, 50, 50) ).toBe(50);
		expect( calculateEcoPercentage(10, 10, 10) ).toEqual(66.66666666666666);
	});
});
