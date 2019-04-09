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


import TeamSwitcher from './TeamSwitcher';

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

interface IHeaderState {
	auth: boolean;
	admin: boolean;
	anchorEl: any;
}

interface IHeaderProps {
	classes: any;
	onDrawerToggle: any;
	children?: React.ReactNode;
}

function Header(props: IHeaderProps) {
	const { classes, onDrawerToggle } = props;

	return (
	  <React.Fragment>
		<AppBar color="primary" position="sticky" elevation={0}>
		  <Toolbar>
			<Grid container spacing={8} alignItems="center">
			  <Hidden smUp>
				<Grid item>
				  <IconButton
					color="inherit"
					aria-label="Open drawer"
					onClick={onDrawerToggle}
					className={classes.menuButton}
				  >
					<MenuIcon />
				  </IconButton>
				</Grid>
			  </Hidden>
			  <Grid item xs />
			  <Grid item>
				<TeamSwitcher />
			  </Grid>
			  <Grid item>
				<Tooltip title="Alerts • No alters">
				  <IconButton color="inherit">
					<NotificationsIcon />
				  </IconButton>
				</Tooltip>
			  </Grid>
			  <Grid item>
				<IconButton color="inherit" className={classes.iconButtonAvatar}>
				  <Avatar className={classes.avatar} src="https://api.adorable.io/avatars/285/111100.png" />
				</IconButton>
			  </Grid>
			</Grid>
		  </Toolbar>
		</AppBar>
	  </React.Fragment>
	);
  }

  Header.propTypes = {
	classes: PropTypes.object.isRequired,
	onDrawerToggle: PropTypes.func.isRequired,
  };

  export default withStyles(styles)(Header);
