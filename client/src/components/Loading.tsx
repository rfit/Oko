
import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	root: {
		flexGrow: 1,
		padding: 20,
		margin: '10px auto',
		maxWidth: 300,
		textAlign: 'center'
	 }
});

interface IHeaderProps {
	classes: any;
	children?: React.ReactNode;
}

function LoadingScreen(props: IHeaderProps) {
	const { classes } = props;

	return (
		<Paper className={classes.root}>
			<Typography variant="body2" gutterBottom>
          		Loading...
        	</Typography>
			<CircularProgress />
		</Paper>
	);
}

export default withStyles(styles)(LoadingScreen);

