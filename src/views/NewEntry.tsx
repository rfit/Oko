import * as React from 'react';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';


export interface INewEntry {
	onSave: () => void;
}

class NewEntry extends React.Component<INewEntry, {}> {
	public render() {
		return (
			<div>
				<Typography component="h1" variant="display2" gutterBottom>
					Opret ny øko
				</Typography>
				<TextField
					variant="filled"
					id="datetime-local"
					label="Oprettelses tid"
					type="datetime-local"
					defaultValue="2017-05-24T10:30"
      			/><br />
				<TextField
					variant="filled"
					id="standard-name"
					label="Faktura/bilag nummer"
					margin="normal"
				/><br />
				<TextField
					type="number"
					variant="filled"
					id="total-price"
					label="kr/kg"
					margin="normal"
				/><br />
				<TextField
					type="number"
					variant="filled"
					id="non-eco"
					label="kr/kg"
					margin="normal"
				/>

<br />
				<Button variant="contained" color="primary">Opret</Button>

			</div>
		);
	}
  }


export default NewEntry;
