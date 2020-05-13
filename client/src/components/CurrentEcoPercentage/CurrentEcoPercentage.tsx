// import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import PropTypes from 'prop-types';

import ErrorIcon from '@material-ui/icons/Error';
import {
	Card,
	CardContent,
	Grid,
	Typography,
	Avatar,
	LinearProgress
} from '@material-ui/core';
import InsertChartIcon from '@material-ui/icons/InsertChartOutlined';

import calculateEcoPercentage from '../../utils/calculateEcoPercentage';

const useStyles = makeStyles(theme => ({
	root:  (props: any) => ({
		height: '100%',
		backgroundColor: props.statusOk ? 'white' : '#ff4949',
		color: props.statusOk ? theme.palette.primary.contrastText : 'white'
	}),
	content: {
		alignItems: 'center',
		display: 'flex'
	},
	title:  (props: any) => ({
		fontWeight: 700,
		color: props.statusOk ? '' : 'white'
	}),
	avatar: (props: any) => ({
		backgroundColor: props.statusOk ? '#1b5e20' : '#ff4949',
		color: '#fff', // theme.palette.white,
		height: 56,
		width: 56
	}),
	icon: {
		height: 32,
		width: 32
	},
	percentageValue: (props: any) => ({
		color: props.statusColor
	}),
	progress: {
		marginTop: theme.spacing(3),
		backgroundColor: '#00695C',
	}
}));

const ColorLinearProgress = withStyles({
	colorPrimary: {
	  backgroundColor: '#b2dfdb',
	},
	barColorPrimary: {
	  backgroundColor: '#00695c',
	},
})(LinearProgress);

const CurrentEcoPercentage = (props: any) => {
	const { eco, nonEco, excluded, className, ...rest } = props;
	const percentage = calculateEcoPercentage(eco, nonEco, excluded);// .toFixed(1)
	const statusOk = percentage >= 90;
	const classes = useStyles({ statusOk });

	return (
		<Card
			{...rest}
			className={clsx(classes.root, className)}
		>
		<CardContent>
			<Grid
			container
			justify="space-between"
			>
			<Grid item>
				<Typography
				className={classes.title}
				color="textSecondary"
				gutterBottom
				variant="body2"
				>
				ØKO PROCENT
				</Typography>
				<Typography className={classes.percentageValue} variant="h3">{percentage.toFixed(1)}%</Typography>
			</Grid>
			<Grid item>
				<Avatar className={classes.avatar}>
					<InsertChartIcon className={classes.icon} />
				</Avatar>
			</Grid>
			</Grid>
			<ColorLinearProgress
				className={classes.progress}
				value={percentage}
				variant="determinate"
			/>
		</CardContent>
		</Card>
	)
};

CurrentEcoPercentage.propTypes = {
	className: PropTypes.string,
	eco: PropTypes.any,
	nonEco: PropTypes.any,
	excluded: PropTypes.any
};

export default CurrentEcoPercentage;
