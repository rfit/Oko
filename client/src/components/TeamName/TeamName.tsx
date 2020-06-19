// import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Link } from 'react-router5'

import {
	Card,
	CardContent,
	Grid,
	Typography,
	Button,
	Avatar
} from '@material-ui/core';
import CardIcon from '@material-ui/icons/Info';

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

interface ITeamNameCardProps {
	team: any; // Should be team data object
	editRoute?: string;
	className?: string;
}

const TeamNameCard = (props: ITeamNameCardProps) => {
	const { className, team, editRoute, ...rest } = props;
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
						TEAM NAVN
						</Typography>
						<Typography variant="h3">{team.name}</Typography>
						{ editRoute && (<Button variant="outlined" size="small" component={Link} routeName={editRoute} routeParams={{ teamId: team.id }}>
							Rediger team
						</Button>)}
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

export default TeamNameCard;
