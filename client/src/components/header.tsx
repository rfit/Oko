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
import { makeStyles } from '@material-ui/core/styles';;
import InputIcon from '@material-ui/icons/Input';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const useStyles = makeStyles(theme => ({
	secondaryBar: {
		zIndex: 0,
	},
	menuButton: {
		marginLeft: -theme.spacing(),
	},
	iconButtonAvatar: {
		padding: 4,
	},
	link: {
		textDecoration: 'none',
		color: lightColor,
		'&:hover': {
			color: theme.palette.common.white
		},
	},
	flexGrow: {
		flexGrow: 1
	  },
	button: {
		borderColor: lightColor,
	},
	signOutButton: {
		marginLeft: theme.spacing(1)
	}
}));

interface IHeaderState {
	auth: boolean;
	admin: boolean;
	anchorEl: any;
}

interface IHeaderProps {
	currentUser: any;
	onDrawerToggle: any;
	children?: React.ReactNode;
}

function Header(props: IHeaderProps) {
	const { onDrawerToggle, currentUser } = props;
	const classes = useStyles();

	return (
	  <React.Fragment>
		<AppBar color="primary" position="sticky" elevation={0}>
		  <Toolbar>
			<Grid container spacing={8} alignItems="center">
			  <Hidden mdUp>
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
			  <Grid item>
				<TeamSwitcher />
			  </Grid>
			  <div className={classes.flexGrow} />
			  <Grid item>
				{currentUser.name} ({currentUser.email})
				<IconButton
					aria-label="sign out"
					className={classes.signOutButton}
					color="inherit"
				>
					<InputIcon />
				</IconButton>
			  </Grid>
			</Grid>
		  </Toolbar>
		</AppBar>
	  </React.Fragment>
	);
  }

Header.propTypes = {
	onDrawerToggle: PropTypes.func.isRequired,
};

export default Header;
