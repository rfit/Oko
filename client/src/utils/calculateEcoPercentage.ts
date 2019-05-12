function calulateEcoPercentage (eco: number, nonEco: number, excluded: number) : number {
	const totalIncluded = eco + nonEco + excluded;
	const ecoOrOk = eco + excluded;
	return ecoOrOk / totalIncluded * 100;
}

export default calulateEcoPercentage
