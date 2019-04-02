function calulateEcoPercentage (eco: number, nonEco: number) : number {
	const totalIncluded = eco + nonEco;
	return eco / totalIncluded * 100;
}

export default calulateEcoPercentage
