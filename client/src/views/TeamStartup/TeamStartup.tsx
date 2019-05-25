import Typography from '@material-ui/core/Typography';
import * as React from 'react';

import SetTeamMesurement from '../../components/SetTeamMesurement';

const TeamSetup = ( props: any ) => (
	<div>
		<Typography component="h2" variant="h2" gutterBottom>
			Opsætning af team
		</Typography>		<Typography paragraph>
			For at komme i gang skal du opsætte dit team.
		</Typography>

		<SetTeamMesurement unitValue={props.currentUser.currentTeam.measurement} teamId={props.currentUser.currentTeam.id} />


	</div>
);

export default TeamSetup;
