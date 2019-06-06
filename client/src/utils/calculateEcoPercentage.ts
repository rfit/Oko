/* calulateEcoPercentage
 * While TypeScript ensures that it's numbers, we sometimes get the data from a value somewhere, this makes us get some string.
 * With the following code we also ensure it's really numbers before we try to calculate.
 */
function calulateEcoPercentage (organicInput: number, nonOrganicInput: number, excludedInput: number) : number {
	const organic = Number(organicInput);
	const nonOrganic = Number(nonOrganicInput);
	const excluded = Number(excludedInput);

	// Total amount
	const total = organic + nonOrganic + excluded;

	// Percent that is considered Organic.
	// If the total amount is excluded, it's zero, and we can't continue as we would devide by zero
	const percentage = total - excluded === 0 ? 100 : organic / (total - excluded) * 100;

	return percentage;
}

export default calulateEcoPercentage;
