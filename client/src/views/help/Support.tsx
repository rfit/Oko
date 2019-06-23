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
				Support
			</Typography>
			<Typography component="h2" variant="h5" gutterBottom>
				Generelt
			</Typography>
			<Typography paragraph>
				<ul>
					<li>
						Stine Eisen, RF Økoansvarlig, 22 15 36 36, <a href="mailto:stine.eisen@roskilde-festival.dk">stine.eisen@roskilde-festival.dk</a>
					</li>
				</ul>
			</Typography>
			<Typography component="h2" variant="h5" gutterBottom>
				Teknisk
			</Typography>
			<Typography paragraph>
				Det er muligt at oprette fejl og ønsker på: <a href="https://github.com/rfit/Oko/issues">GitHub Issues</a>.

				Brug kun telefon hvis det er meget akut. Der bliver tjekket mails løbende.<br /><br />
				<ul>
					<li>
						Allan Kimmer Jensen, 31 58 50 80, <a href="mailto:allan.jensen@roskilde-festival.dk">allan.jensen@roskilde-festival.dk</a>
					</li>
					<li>
						Mikael Sørensen, <a href="mailto:Mikael.Soerensen@roskilde-festival.dk">Mikael.Soerensen@roskilde-festival.dk</a>
					</li>
				</ul>
			</Typography>
		</main>
	);
  }

export default withStyles(styles)(Help);
