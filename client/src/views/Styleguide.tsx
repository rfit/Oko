import * as React from 'react';

import CurrentEcoPercentage from '../components/CurrentEcoPercentage';
import { Grid } from '@material-ui/core';


function Styleguide() {
	return (
		<div>
			<p>Overview of components :-) </p>

			<h1>CurrentEcoPercentage</h1>
			<Grid container spacing={4}>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					<CurrentEcoPercentage eco={100} nonEco={50} excluded={0} />
				</Grid>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					<CurrentEcoPercentage eco={100} nonEco={10} excluded={0} />
				</Grid>
				<Grid item lg={3} sm={6} xl={3} xs={12}>
					<CurrentEcoPercentage eco={100} nonEco={0} excluded={0} />
				</Grid>
			</Grid>
		</div>
	);
  }

export default Styleguide;
