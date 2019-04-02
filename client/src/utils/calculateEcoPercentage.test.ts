import calculateEcoPercentage from './calculateEcoPercentage';

describe('action keys', () => {
    it('should calulate percentage corrently', () => {
		expect( calculateEcoPercentage(100, 200) ).toBe(33.33333333333333);
		expect( calculateEcoPercentage(100, 0) ).toBe(100);
		expect( calculateEcoPercentage(0, 100) ).toBe(0);
    });
});
