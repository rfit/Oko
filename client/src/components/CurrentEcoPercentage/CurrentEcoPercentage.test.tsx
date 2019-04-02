// import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';

import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import ErrorIcon from '@material-ui/icons/Error';

import calculateEcoPercentage from '../../utils/calculateEcoPercentage';

const CurrentEcoPercentage = (props: any) => {
	const { eco, nonEco } = props;
	const percentage = calculateEcoPercentage(eco, nonEco);// .toFixed(1)

	if(percentage >= 90) {
		return (
			<Card style={{ background: 'green' }}>
				<Typography component="h3" style={{ padding: 10 }}>
					Nuværende øko procent: {percentage.toFixed(1)}%
				</Typography>
			</Card>
		)
	} else {
		return (
			<Card style={{ background: 'red' }}>
				<Typography component="h3" style={{ padding: 10 }}>
					<ErrorIcon />Nuværende øko procent: {percentage.toFixed(1)}%
				</Typography>
			</Card>
		);
	}
};

export default CurrentEcoPercentage;
