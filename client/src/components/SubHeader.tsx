import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	secondaryBar: {
		zIndex: 0,
	},
	menuButton: {
		marginLeft: -spacing.unit,
	},
	iconButtonAvatar: {
		padding: 4,
	},
	link: {
		textDecoration: 'none',
		color: lightColor,
		'&:hover': {
			color: palette.common.white,
		},
	},
	button: {
		borderColor: lightColor,
	},
});

interface IHeaderProps {
	title: string;
	classes: any;
	children?: React.ReactNode;
}

function SubHeader(props: IHeaderProps) {
	const { classes, title } = props;

	return (
	  <React.Fragment>
		<AppBar
			component="div"
			className={classes.secondaryBar}
			color="primary"
			position="static"
			elevation={0}
		>
		  <Toolbar>
			<Grid container alignItems="center" spacing={8}>
			  <Grid item xs>
				<Typography color="inherit" variant="h5">
				  {title}
				</Typography>
			  </Grid>
			</Grid>
		  </Toolbar>
		</AppBar>

		<AppBar
		  component="div"
		  className={classes.secondaryBar}
		  color="primary"
		  position="static"
		  elevation={0}
		>
			<Tabs value={0} textColor="inherit">
				<Tab textColor="inherit" label="Users" />
				<Tab textColor="inherit" label="Sign-in method" />
				<Tab textColor="inherit" label="Templates" />
				<Tab textColor="inherit" label="Usage" />
			</Tabs>
		</AppBar>
	  </React.Fragment>
	);
}

export default withStyles(styles)(SubHeader);
