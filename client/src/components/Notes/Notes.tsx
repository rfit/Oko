// import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

import {
	Card,
	CardContent,
	Grid,
	Typography,
	Avatar
} from '@material-ui/core';
import CardIcon from '@material-ui/icons/Notes';

const useStyles = makeStyles(theme => ({
	root: {
		height: '100%',
	},
	content: {
		alignItems: 'center',
		display: 'flex'
	},
	title: {
		fontWeight: 700
	},
	avatar: (props: any) => ({
		backgroundColor: 'rgb(100, 134, 164)',
		color: '#fff', // theme.palette.white,
		height: 56,
		width: 56
	}),
	icon: {
		height: 32,
		width: 32
	},
}));

interface INotesProps {
	notes: string;
	className?: string;
}

const Notes = (props: INotesProps) => {
	const { className, ...rest } = props;
	const classes = useStyles();

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
						NOTER
						</Typography>
						<Typography variant="body1">{props.notes}</Typography>
					</Grid>
					<Grid item>
						<Avatar className={classes.avatar}>
							<CardIcon className={classes.icon} />
						</Avatar>
					</Grid>
				</Grid>
			</CardContent>
		</Card>
	)
};

export default Notes;
