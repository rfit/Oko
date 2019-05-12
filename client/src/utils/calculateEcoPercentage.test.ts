import calculateEcoPercentage from './calculateEcoPercentage';

describe('action keys', () => {
    it('should calulate percentage corrently', () => {
		expect( calculateEcoPercentage(100, 200, 0) ).toBe(33.33333333333333);
		expect( calculateEcoPercentage(100, 0, 0) ).toBe(100);
		expect( calculateEcoPercentage(0, 100, 0) ).toBe(0);
		expect( calculateEcoPercentage(0, 50, 50) ).toBe(50);
    });
});
