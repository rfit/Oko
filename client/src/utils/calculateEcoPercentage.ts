function calulateEcoPercentage (eco: number, nonEco: number, excluded: number) : number {
	// Total amount
	const total = Number(eco) + Number(nonEco) + Number(excluded);
	// Amount considered ECO
	const ecoOrOk = Number(eco) + Number(excluded);

	// console.log(total, ecoOrOk, eco, nonEco, excluded, Number(eco)/(total - Number(excluded)) * 100);

	// Percent that is considered ECO
	return Number(eco)/(total - Number(excluded)) * 100;
}

export default calulateEcoPercentage
