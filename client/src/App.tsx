import CssBaseline from '@material-ui/core/CssBaseline';
import { RouteNode, routeNode, withRouter, withRoute, useRoute } from 'react-router5'
import { Query } from 'react-apollo';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import * as React from 'react';
import gql from 'graphql-tag';

import Hidden from '@material-ui/core/Hidden';
import Navigator from './components/Navigator';
import Header from './components/header';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorView from './components/ErrorView';

import FestivalOverview from './views/FestivalOverview';
import FestivalOverviewTeam from './views/FestivalOverviewTeam';
import Help from './views/help';
import HelpGenral from './views/help/General';
import HelpSupport from './views/help/Support';
import Styleguide from './views/Styleguide';
import Login from './views/login';
import NewEntry from './views/NewEntry';
import NewCreditnote from './views/NewCreditnote';
import EditInvoice from './views/EditInvoice';
import Overview from './views/Overview';
import TeamAdmin from './views/TeamAdmin';
import { ApolloClient } from 'apollo-boost';
import Loading from './components/Loading';
import TeamSetupView from './views/TeamStartup';

import WarningIcon from '@material-ui/icons/Warning';

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
			id,
			name,
			email,
			role,
			currentTeam {
				measurement,
				notes,
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
			<Query<any, any> query={GET_CURRENT_USER}>
				{({ loading, error, data }) => {

					console.log('GET_CURRENT_USER', data);

					if(loading) { return <Loading />; }
					if(error) {
						const AuthError = error.graphQLErrors.find((err) => err && err.extensions && err.extensions.code === "UNAUTHENTICATED" ? true : false);
						if(AuthError) {
							return (
								<div className={classes.root}>
									<CssBaseline />
									<main className={classes.appContent}>
										<Login loginFunction={this.handleLoginFake}  />
									</main>
								</div>
							)
						}

						if(typeof(error) === "object") {
							return  (
								<div className={classes.root}>
									<CssBaseline />
									<main className={classes.appContent}>
										<ErrorView error={{message: JSON.stringify(error)}} />
									</main>
								</div>
							)
						}
						return (
							<div className={classes.root}>
								<CssBaseline />
								<main className={classes.appContent}>
									<ErrorView error={{message: error}} />
								</main>
							</div>
						);
					}

					if(!data.currentUser) {
						console.log('Current user is not set, we should login.');
						// We don't have a user
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
						if('ADMIN' === data.currentUser.role) {
							return (
								<div className={classes.root}>
									<CssBaseline />
									<main className={classes.mainContent}>
										<TeamSetupView {...data} />
									</main>
								</div>
							)
						}
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
								<ErrorBoundary>
									{ !data.currentUser.currentTeam.measurement || data.currentUser.currentTeam.measurement === "null" && (
										<div style={{
											backgroundColor: '#ffa000',
											boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
											padding: 8,
											marginBottom: 25
										}}>
											<WarningIcon style={{ margin: '0 8px 0 0' }} />
											<span>Din leder har ikke gennemført opsætningen af teamet, endnu. Ikke alle funktioner er aktiveret.</span>
										</div>
									)}

									{topRouteName === 'overview' && <Overview {...data} /> }
									{topRouteName === 'team-admin' && <TeamAdmin {...data} /> }
									{topRouteName === 'add-invoice' && <NewEntry {...data} route={route} router={router} /> }
									{topRouteName === 'add-creditnote' && <NewCreditnote {...data} route={route} router={router} /> }
									{topRouteName === 'edit-invoice' && <EditInvoice {...data} route={route} router={router}  /> }
									{topRouteName === 'festival-overview' && <FestivalOverview {...data} route={route} router={router}  /> }
									{topRouteName === 'festival-overview-team' && <FestivalOverviewTeam {...data} route={route} router={router}  /> }
									{topRouteName === 'help' && <Help /> }
									{topRouteName === 'help-general' && <HelpGenral /> }
									{topRouteName === 'help-support' && <HelpSupport /> }
									{topRouteName === 'styleguide' && <Styleguide /> }
								</ErrorBoundary>
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
