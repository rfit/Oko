import CssBaseline from '@material-ui/core/CssBaseline';
import { RouteNode, routeNode, withRouter, withRoute, useRoute } from 'react-router5'
import { Query } from 'react-apollo';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import gql from 'graphql-tag';

import Hidden from '@material-ui/core/Hidden';
import Navigator from './components/Navigator';
import Header from './components/header';

import FestivalOverview from './views/FestivalOverview';
import Help from './views/help';
import Styleguide from './views/Styleguide';
import Login from './views/login';
import NewEntry from './views/NewEntry';
import EditInvoice from './views/EditInvoice';
import Overview from './views/Overview';
import TeamAdmin from './views/TeamAdmin';
import { ApolloClient } from 'apollo-boost';
import Loading from './components/Loading';
import TeamSetupView from './views/TeamStartup';

interface IAppState {
	open: boolean;
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
		[breakpoints.up('md')]: {
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
		padding: '48px 36px 20px',
		background: '#eaeff1',
	},
});

const GET_CURRENT_USER = gql`
	query GetCurrentUser {
		currentUser {
			name,
			uid,
			role,
			currentTeam {
				measurement,
				id,
				name
			},
			teams {
				measurement,
				id,
				name
			}
		}
	}
`;

class App extends React.Component<IAppProps, IAppState> {
	public state: Readonly<IAppState> = {
		open: false,
		mobileOpen: false,
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
		const { classes, route, router } = this.props;
		// console.log('route!', this.props);
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
			<Query query={GET_CURRENT_USER}>
				{({ loading, error, data }) => {

					console.log('GET_CURRENT_USER', data);

					if(loading) { return <Loading />; }
					if(error) { return <div>{error}</div>; }

					if(!data.currentUser) {
						// We don't have a user
						router.navigate('login');
						return (
							<div className={classes.root}>
								<CssBaseline />
								<main className={classes.appContent}>
									<Login loginFunction={this.handleLoginFake}  />
								</main>
							</div>
						)
					}

					// Is user setup? (Has changed password-)
					if(false) {
						return (
							<div className={classes.root}>
								<CssBaseline />
								<main className={classes.mainContent}>
									<div>Du skal skifte kodeord</div>
								</main>
							</div>
						)
					}

					// Is Team setup?
					if(!data.currentUser.currentTeam.measurement || data.currentUser.currentTeam.measurement === "null") {
						if('Admin' === data.currentUser.role) {
							return (
								<div className={classes.root}>
									<CssBaseline />
									<main className={classes.mainContent}>
										<TeamSetupView {...data} />
									</main>
								</div>
							)
						}

						return (
							<div className={classes.root}>
								<CssBaseline />
								<main className={classes.mainContent}>
									<div>Din leder har ikke gennemført opsætningen af teamet, endnu.</div>
								</main>
							</div>
						)
					}

					return (
						<div className={classes.root}>
						<CssBaseline />
						<nav className={classes.drawer}>
							<Hidden mdUp implementation="js">
								<Navigator
									role={data.currentUser.role}
									PaperProps={{ style: { width: drawerWidth } }}
									variant="temporary"
									open={this.state.mobileOpen}
									onClose={this.handleDrawerToggle}
								/>
							</Hidden>
							<Hidden smDown implementation="css">
								<Navigator role={data.currentUser.role} PaperProps={{ style: { width: drawerWidth } }} />
							</Hidden>
						</nav>
						<main className={classes.appContent}>
							<Header onDrawerToggle={this.handleDrawerToggle} currentUser={data.currentUser} />
							<main className={classes.mainContent}>
								{/* <Content />*/}
								{topRouteName === 'overview' && <Overview {...data} /> }
								{topRouteName === 'team-admin' && <TeamAdmin {...data} /> }
								{topRouteName === 'add-invoice' && <NewEntry {...data} route={route} router={router} /> }
								{topRouteName === 'edit-invoice' && <EditInvoice {...data} route={route} router={router}  /> }
								{topRouteName === 'festival-overview' && <FestivalOverview {...data} route={route} router={router}  /> }
								{topRouteName === 'help' && <Help /> }
								{topRouteName === 'styleguide' && <Styleguide /> }
							</main>
						</main>
					</div>
					);
				}}
			</Query>

		);
	}
}

export default withStyles(styles)(App);
