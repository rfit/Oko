import * as React from 'react';

import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';

const styles: any = (theme: any) => ({
	wrap: {
		display: 'flex',
		alignItems: 'center',
		  justifyContent: 'center',
		  height: '100%'
	},
	layout: {
	  width: 'auto',
	  display: 'block', // Fix IE 11 issue.
	  marginLeft: theme.spacing.unit * 3,
	  marginRight: theme.spacing.unit * 3,
	  [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
		width: 400,
		marginLeft: 'auto',
		marginRight: 'auto',
	  },
	},
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
  		justifyContent: 'center',
		padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: '#fff',
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
	},
	submit: {
		marginTop: theme.spacing.unit * 3,
	},
  });

interface ILoginProps {
	loginFunction: () => void;
	classes: any;
}

// Configure FirebaseUI.
const uiConfig = {
	// Popup signin flow rather than redirect flow.
	signInFlow: 'popup',
	// Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
	signInSuccessUrl: '/signedIn',
	// We will display Google and Facebook as auth providers.
	signInOptions: [
		firebase.auth.EmailAuthProvider.PROVIDER_ID

	  // firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	  // firebase.auth.FacebookAuthProvider.PROVIDER_ID
	],
	credentialHelper: 'none' // firebase.CredentialHelper.NONE
  };

function Login(props: ILoginProps) {
	const { classes } = props;
	return (
		<div className={classes.wrap}>
			<div className={classes.layout}>

			<Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
				<LockIcon />
				</Avatar>
				<Typography variant="overline">
					Roskilde Festival
				</Typography>
				<Typography component="h1" variant="h5">
					Økologi Tracker
				</Typography>

				<br /><br />
				<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>

				{/*
				<Button
					onClick={props.loginFunction}
					type="submit"
					fullWidth
					variant="contained"
					color="primary"
					className={classes.submit}
				>
					Login via Heimdal
				</Button>
				*/}
			</Paper>
			</div>
		</div>
	);
  }

export default withStyles(styles)(Login);
