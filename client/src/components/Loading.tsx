
import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({

});

interface IHeaderProps {
	classes: any;
	children?: React.ReactNode;
}

function LoadingScreen(props: IHeaderProps) {
	const { classes } = props;

	return (
		<React.Fragment>
			Loading
			<CircularProgress />
		</React.Fragment>
	);
}

export default withStyles(styles)(LoadingScreen);

