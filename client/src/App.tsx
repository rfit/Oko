import CssBaseline from '@material-ui/core/CssBaseline';
import { RouteNode, routeNode, withRouter, withRoute, useRoute } from 'react-router5'
import { Query } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import gql from 'graphql-tag';

import Hidden from '@material-ui/core/Hidden';
import Navigator from './components/Navigator';
import Header from './components/header';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorView from './components/ErrorView';

import FestivalOverview from './views/FestivalOverview';
import FestivalOverviewTeam from './views/FestivalOverviewTeam';
import FestivalOverviewTeamEdit from './views/SuperAdmin/EditTeam';
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
import FestivalIteration from './views/SuperAdmin/FestivalIteration';

import WarningIcon from '@material-ui/icons/Warning';

interface IAppState {
	open: boolean;
	mobileOpen: boolean;
}

interface IAppProps {
	clientState?: any;
	client: ApolloClient<any>;
	[key: string]: any
}

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
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
		[theme.breakpoints.up('md')]: {
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
}));


// we use @client for development currently
const GET_CURRENT_USER = gql`
	query GetCurrentUser {
		currentUser @client {
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

function App (props: IAppProps) {
	const { route, router } = props;
	const classes = useStyles();
	const [openState, setOpenState] = useState(false);
	const [mobileOpenState, setMobileOpenState]  = useState(false);

	const handleDrawerOpen = () => {
		setOpenState(true);
	};

	const handleDrawerClose = () => {
		setOpenState(false);

	};

	const handleDrawerToggle = () => {
		setMobileOpenState(!mobileOpenState)
	};

	const handleLoginFake = (email: string, pwd: string) => {
		console.log('logging in!');

		const loginInfo = {
			email,
			password: pwd
		};

		fetch('http://localhost:8082/login', {
			method: 'POST',
			body: JSON.stringify(loginInfo),
		})
		.then(response => response.json())
		.then(result => {
			console.log('Success:', result);
			setOpenState(true);
		})
		.catch(loginerror => {
			console.error('Error:', loginerror);
		});


		// props.client.writeData({
		// 	data: {
		// 		currentUser: {
		// 			id: 0,
		// 			name: 'test',
		// 			email: 'test@test.test',
		// 			__typename: 'User'
		// 		},
		// 		isLoggedIn: true
		// 	}
		// });
		setOpenState(true);
	};


	// console.log('route!', this.props);
	const topRouteName = route.name.split('.')[0]

	console.log('clientState', props.clientState);

	const { loading, data, error } = useQuery<any, any>(
		GET_CURRENT_USER
	);

	if(!props.clientState.isLoggedIn) {
		console.log('not logged in');
		return (
			<div className={classes.root}>
				<CssBaseline />
				<main className={classes.appContent}>
					<Login loginFunction={handleLoginFake}  />
				</main>
			</div>
		);
	}

	console.log('GET_CURRENT_USER', data);

	if(loading) { return <Loading />; }
	if(error) {
		const AuthError = error.graphQLErrors.find((err) => err && err.extensions && err.extensions.code === "UNAUTHENTICATED" ? true : false);
		if(AuthError) {
			return (
				<div className={classes.root}>
					<CssBaseline />
					<main className={classes.appContent}>
						<Login loginFunction={handleLoginFake}  />
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
		console.log('Current user is not set, we should login.', data.currentUser);
		// We don't have a user
		return (
			<div className={classes.root}>
				<CssBaseline />
				<main className={classes.appContent}>
					<Login loginFunction={handleLoginFake}  />
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

	// There's no team for the user
	if(!data.currentUser.teams || data.currentUser.teams.length <= 0) {
		return (
			<div className={classes.root}>
				<CssBaseline />
				<main className={classes.mainContent}>
					<p>Der er ikke tilknyttet et hold til denne bruger.</p>
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
					open={mobileOpenState}
					onClose={handleDrawerToggle}
				/>
			</Hidden>
			<Hidden smDown implementation="css">
				<Navigator role={data.currentUser.role} PaperProps={{ style: { width: drawerWidth } }} />
			</Hidden>
		</nav>
		<main className={classes.appContent}>
			<Header onDrawerToggle={handleDrawerToggle} currentUser={data.currentUser} />
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
					{topRouteName === 'festival-overview-team-edit' && <FestivalOverviewTeamEdit {...data} route={route} router={router}  /> }
					{topRouteName === 'festival-iteration' && <FestivalIteration {...data} route={route} router={router}  /> }
					{topRouteName === 'help' && <Help /> }
					{topRouteName === 'help-general' && <HelpGenral /> }
					{topRouteName === 'help-support' && <HelpSupport /> }
					{topRouteName === 'styleguide' && <Styleguide /> }
				</ErrorBoundary>
			</main>
		</main>
	</div>
	);
}

export default App;
