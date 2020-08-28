import * as React from 'react';

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
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(3),
		[theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
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
		padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
	},
	avatar: {
		margin: theme.spacing(),
		backgroundColor: '#fff',
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(),
	},
	submit: {
		marginTop: theme.spacing(3),
	},
});

interface ILoginProps {
	loginFunction: (email: string, password: string) => void;
	classes: any;
}

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

					<br />

					<Button
						// tslint:disable-next-line: jsx-no-lambda
						onClick={() => props.loginFunction('test', 'test')}
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
					>
						Fake login
					</Button>

				</Paper>
			</div>
		</div>
	);
  }

export default withStyles(styles)(Login);
