import CssBaseline from '@material-ui/core/CssBaseline';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import * as React from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SettingsApplications from '@material-ui/icons/SettingsApplications';

import Admin from './views/admin';
import Dashboard from './views/dashboard';
import Login from './views/login';
import NewEntry from './views/NewEntry';
import Overview from './views/Overview';


interface IAppState {
	open: boolean;
}

interface IAppProps {
	classes: any;
}

const drawerWidth = 240;

const styles = ({ palette, spacing, breakpoints, mixins, transitions, zIndex }: Theme) => createStyles({
	'@global': {
		body: {
		    minHeight: '100vh',
			backgroundColor: palette.common.white,
		}
	},
	root: {
		display: 'flex',
		minHeight: '100vh',
	},
	appBar: {
		zIndex: zIndex.drawer + 1,
		transition: transitions.create(['width', 'margin'], {
			easing: transitions.easing.sharp,
			duration: transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: transitions.create(['width', 'margin'], {
			easing: transitions.easing.sharp,
			duration: transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginLeft: 12,
		marginRight: 36,
	},
	hide: {
		display: 'none',
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: transitions.create('width', {
			easing: transitions.easing.sharp,
			duration: transitions.duration.enteringScreen,
		}),
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: transitions.create('width', {
			easing: transitions.easing.sharp,
			duration: transitions.duration.leavingScreen,
		}),
		width: spacing.unit * 7,
		[breakpoints.up('sm')]: {
			width: spacing.unit * 9,
		},
	},
	toolbar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...mixins.toolbar,
	},
	content: {
		flexGrow: 1,
		padding: spacing.unit * 3,
	},
});

class App extends React.Component<IAppProps, IAppState> {
	public state: Readonly<IAppState> = {
		open: false
	};
	public handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	public handleDrawerClose = () => {
		this.setState({ open: false });
	};

	public render() {
		const { classes } = this.props;

		return (
			<Router>
				<div className={classes.root}>
					<CssBaseline />
					<AppBar
						position="fixed"
						className={classNames(classes.appBar, {
							[classes.appBarShift]: this.state.open,
						})}
						>
						<Toolbar disableGutters={!this.state.open}>
							<IconButton
							color="inherit"
							aria-label="Open drawer"
							onClick={this.handleDrawerOpen}
							className={classNames(classes.menuButton, {
								[classes.hide]: this.state.open,
							})}
							>
							<MenuIcon />
							</IconButton>
							<Typography variant="h6" color="inherit" noWrap>
								ØkoApp
							</Typography>
						</Toolbar>
					</AppBar>
					<Drawer
						variant="permanent"
						classes={{
							paper: classNames(classes.drawerPaper, !this.state.open && classes.drawerPaperClose),
						}}
						open={this.state.open}
					>
						<div className={classes.toolbar}>
							<IconButton onClick={this.handleDrawerClose}>
								<ChevronLeftIcon />
							</IconButton>
						</div>
						<Divider />
						<List>
							{/* tslint:disable-next-line jsx-no-lambda */ }
							<ListItem button component={(props: any) => <Link to="/" {...props} />}>
								<ListItemIcon><InboxIcon /></ListItemIcon>
								<ListItemText primary="Oversigt" />
							</ListItem>
							{/* tslint:disable-next-line jsx-no-lambda */ }
							<ListItem button component={(props: any) => <Link to="/create-new" {...props} />}>
								<ListItemIcon><AddIcon /></ListItemIcon>
								<ListItemText primary="Ny indmeldning" />
							</ListItem>
						</List>
						<Divider />
						<List>
							{/* tslint:disable-next-line jsx-no-lambda */ }
							<ListItem button component={(props: any) => <Link to="/admin" {...props} />}>
								<ListItemIcon><SettingsApplications /></ListItemIcon>
								<ListItemText primary="Bod Admin" />
							</ListItem>
							<Divider />
						<List>
							{/* tslint:disable-next-line jsx-no-lambda */ }
							<ListItem button {...{ to: "/help" }} component={Link}>
								<ListItemIcon><HelpIcon /></ListItemIcon>
								<ListItemText primary="Bod Admin" />
							</ListItem>
						</List>
						</List>
					</Drawer>
					<main className={classes.content}>
						<div className={classes.toolbar} />
						<Route exact path="/" component={Overview} />
						<Route path="/login" component={Login} />
						<Route path="/admin" component={Admin} />
						<Route path="/create-new" component={NewEntry} />
						<Route path="/dashboard" component={Dashboard} />
						<Menu />
					</main>
				</div>
			</Router>
		);
	}
}

const Menu = () => (
	<ul>
		<li>
			<Link to="/login">Login</Link>
		</li>
		<li>
			<Link to="/dashboard">Dashboard</Link>
		</li>
	</ul>
);


export default withStyles(styles)(App);
