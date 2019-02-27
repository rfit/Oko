import * as React from 'react';

// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
// import LockIcon from '@material-ui/icons/LockOutlined';

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
});

function Help(props: any) {
	const { classes } = props;

	return (
		<React.Fragment>
			<main className={classes.layout}>
				<Typography component="h1" variant="display2" gutterBottom>
					Hjælp
				</Typography>
				<Typography paragraph>
					Der er ingen hjælp at få :-(
				</Typography>
			</main>
		</React.Fragment>
	);
  }

export default withStyles(styles)(Help);
