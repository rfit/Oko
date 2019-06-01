import * as React from 'react';

// import Button from '@material-ui/core/Button';
// import CssBaseline from '@material-ui/core/CssBaseline';
// import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
// import LockIcon from '@material-ui/icons/LockOutlined';

const styles: any = (theme: any) => ({
});

function Help(props: any) {
	// const { classes } = props;

	return (
		<main>
			<Typography component="h1" variant="h2" gutterBottom>
				Hjælp
			</Typography>
			<Typography paragraph>
				Her kan du finde hjælp.
			</Typography>
			<Typography component="h2" variant="h5" gutterBottom>
				Hvordan ændre jeg mit teams måle endhed?
			</Typography>
			<Typography paragraph>
				Du kan ikke ændre dette.
			</Typography>
		</main>
	);
  }

export default withStyles(styles)(Help);
