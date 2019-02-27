import * as React from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LockIcon from '@material-ui/icons/LockOutlined';

const styles: any = (theme: any) => ({
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
	  marginTop: theme.spacing.unit * 8,
	  display: 'flex',
	  flexDirection: 'column',
	  alignItems: 'center',
	  padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
	},
	avatar: {
	  margin: theme.spacing.unit,
	  backgroundColor: theme.palette.secondary.main,
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
	onClick: () => void;
	classes: any;
}

function Login(props: ILoginProps) {
	const { classes } = props;
	console.log(props.onClick);
	return (
	  <React.Fragment>
		<CssBaseline />
		<main className={classes.layout}>
		  <Paper className={classes.paper}>
			<Avatar className={classes.avatar}>
			  <LockIcon />
			</Avatar>
			<Typography component="h1" variant="h5">
				Log ind
			</Typography>

			<Button
				onClick={props.onClick}
				type="submit"
				fullWidth
				variant="contained"
				color="primary"
				className={classes.submit}
			  >
				Heimdal
			  </Button>
		  </Paper>
		</main>
	  </React.Fragment>
	);
  }

export default withStyles(styles)(Login);
