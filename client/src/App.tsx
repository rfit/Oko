import CssBaseline from '@material-ui/core/CssBaseline';
import { RouteNode, routeNode, withRouter, withRoute, useRoute } from 'react-router5'

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';

import Hidden from '@material-ui/core/Hidden';
import Navigator from './components/Navigator';
import Header from './components/Header';

import Dashboard from './views/dashboard';
import Help from './views/help';
import Styleguide from './views/Styleguide';
import Login from './views/login';
import NewEntry from './views/NewEntry';
import Overview from './views/Overview';
import TeamAdmin from './views/TeamAdmin';
import { ApolloClient } from 'apollo-boost';

interface IAppState {
	open: boolean;
	loggedin: boolean;
	mobileOpen: boolean;
}

interface IAppProps {
	clientState?: any;
	client: ApolloClient<any>;
	classes: any;
	[key:string]: any
}

const drawerWidth = 240;

const styles = ({ palette, spacing, breakpoints, mixins, transitions, zIndex }: Theme) => createStyles({
	'@global': {
		body: {
		    minHeight: '100vh',
			backgroundColor: '#1b1b1b' // '#0a0a0a',
		},
		'::selection': {
			background: '#ee7203',
			color: '#fff'
		}
	},
	root: {
		display: 'flex',
		minHeight: '100vh',
	},
	drawer: {
		[breakpoints.up('sm')]: {
			width: drawerWidth,
			flexShrink: 0,
		},
	},
	appContent: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
	},
	mainContent: {
		flex: 1,
		padding: '48px 36px 0',
		background: '#eaeff1',
	},
});

class App extends React.Component<IAppProps, IAppState> {
	public state: Readonly<IAppState> = {
		open: false,
		mobileOpen: false,
		loggedin: true // false when deploy
	};
	public handleDrawerOpen = () => {
		this.setState({ open: true });
	};

	public handleDrawerClose = () => {
		this.setState({ open: false });
	};

	public handleDrawerToggle = () => {
		this.setState(state => ({ mobileOpen: !state.mobileOpen }));
	};

	public handleLoginFake = () => {
		console.log('logging in!');
		this.props.client.writeData({ data: { isLoggedIn: true } })
	};

	public render() {
		const { classes, route } = this.props;
		console.log('route!', this.props);
		const topRouteName = route.name.split('.')[0]

		console.log('clientState', this.props.clientState);

		if(!this.props.clientState.isLoggedIn) {
			console.log('not logged in');
			return (
				<div className={classes.root}>
					<CssBaseline />
					<main className={classes.appContent}>
						<Login loginFunction={this.handleLoginFake}  />
					</main>
				</div>
			);
		}

		return (
				<div className={classes.root}>
					<CssBaseline />
					<nav className={classes.drawer}>
						<Hidden smUp implementation="js">
							<Navigator
								PaperProps={{ style: { width: drawerWidth } }}
								variant="temporary"
								open={this.state.mobileOpen}
								onClose={this.handleDrawerToggle}
							/>
						</Hidden>
						<Hidden xsDown implementation="css">
							<Navigator PaperProps={{ style: { width: drawerWidth } }} />
						</Hidden>
					</nav>
					<main className={classes.appContent}>
						<Header onDrawerToggle={this.handleDrawerToggle} />
						<main className={classes.mainContent}>
							{/* <Content />*/}
							{topRouteName === 'overview' && <Overview /> }
							{topRouteName === 'team-admin' && <TeamAdmin /> }
							{topRouteName === 'add-invoice' && <NewEntry /> }
							{topRouteName === 'dashboard' && <Dashboard /> }
							{topRouteName === 'help' && <Help /> }
							{topRouteName === 'styleguide' && <Styleguide /> }
						</main>
					</main>
				</div>
		);
	}
}

export default withStyles(styles)(App);
