import * as React from 'react';

import CurrentEcoPercentage from '../components/CurrentEcoPercentage';

function Styleguide() {
	return (
		<div>
			<p>Overview of components :-) </p>
			<CurrentEcoPercentage eco={100} nonEco={50} />
			<CurrentEcoPercentage eco={100} nonEco={0} />
		</div>
	);
  }

export default Styleguide;
