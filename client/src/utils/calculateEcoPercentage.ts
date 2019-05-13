function calulateEcoPercentage (eco: number, nonEco: number, excluded: number) : number {
	// Total amount
	const total = Number(eco) + Number(nonEco) + Number(excluded);
	// Amount considered ECO
	const ecoOrOk = Number(eco) + Number(excluded);

	console.log(total, ecoOrOk, eco, nonEco, excluded);


	// Percent that is considered ECO
	return ecoOrOk / total * 100;
}

export default calulateEcoPercentage
