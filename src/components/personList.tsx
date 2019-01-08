import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import DeleteIcon from '@material-ui/icons/Delete';
import * as React from 'react';

export interface IPerson {
	id: number;
	name: string;
}

export interface IPersonListProps {
	persons: IPerson[];
	onDeletePerson: () => void;
}

class PeopleList extends React.Component<IPersonListProps, {}> {
	public onClickDelete() {
		// tslint:disable-next-line:no-console
		console.log('Delete person from list');
		// this.props.onDeletePerson();
	}
	public render() {
		return (
			<List>
				{this.props.persons.map((person) => (
					<ListItem key={person.id}>
						<Avatar alt={person.name} src={`https://api.adorable.io/avatars/285/${person.name}.png`} />
						<ListItemText primary={person.name} />
						<ListItemSecondaryAction>
							<IconButton aria-label="Delete" onClick={this.onClickDelete}>
								<DeleteIcon />
							</IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				))}
			</List>
		);
	}
  }


export default PeopleList;
