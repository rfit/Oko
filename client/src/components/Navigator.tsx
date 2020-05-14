import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import PhoneIcon from '@material-ui/icons/Phone';
import PeopleIcon from '@material-ui/icons/People';
import AddIcon from '@material-ui/icons/Add';
import HelpIcon from '@material-ui/icons/Help';

import { Link } from 'react-router5';

// import TimerIcon from '@material-ui/icons/Timer';
import SettingsIcon from '@material-ui/icons/Settings';
// import PhonelinkSetupIcon from '@material-ui/icons/PhonelinkSetup';

enum Roles {
	SUPERADMIN = 'SUPERADMIN',
	AUDITOR = 'AUDITOR',
	ADMIN = 'ADMIN',
	EDITOR = 'EDITOR',
}

const categories = [
	{
		id: 'Team',
		roleAccess: [Roles.SUPERADMIN, Roles.ADMIN, Roles.EDITOR],
		children: [
			{
				id: 'Oversigt',
				icon: <PeopleIcon />,
				routeName: 'overview',
				active: true,
			},
			{ id: 'Ny Faktura', icon: <AddIcon />, routeName: 'add-invoice' },
			{
				id: 'Ny Kreditnota',
				icon: <AddIcon />,
				routeName: 'add-creditnote',
			},
		],
	},
	{
		id: 'Team Admin',
		roleAccess: [Roles.SUPERADMIN, Roles.ADMIN, Roles.EDITOR],
		children: [
			{
				id: 'Mål & Adgang',
				routeName: 'team-admin',
				icon: <PeopleIcon />,
			},
			// { id: 'Måle enhed', routeName: 'team-admin', icon: <SettingsIcon /> },
		],
	},
	{
		id: 'Super Admin',
		roleAccess: [Roles.SUPERADMIN, Roles.AUDITOR],
		children: [
			{
				id: 'Oversigt',
				routeName: 'festival-overview',
				icon: <SettingsIcon />,
			},
			{
				id: 'Iteration',
				routeName: 'festival-iteration',
				icon: <SettingsIcon />,
			},
			{
				id: 'Teams',
				routeName: 'festival-teams',
				icon: <SettingsIcon />,
			},
		],
	},
	{
		id: 'Hjælp',
		roleAccess: [
			Roles.SUPERADMIN,
			Roles.AUDITOR,
			Roles.ADMIN,
			Roles.EDITOR,
		],
		children: [
			{ id: 'Generelt', icon: <HelpIcon />, routeName: 'help-general' },
			{ id: 'Support', icon: <PhoneIcon />, routeName: 'help-support' },
			{ id: 'FAQ', icon: <QuestionAnswerIcon />, routeName: 'help' },
		],
	},
];

const useStyles = makeStyles((theme) => ({
	categoryHeader: {
		paddingTop: 16,
		paddingBottom: 16,
	},
	categoryHeaderPrimary: {
		color: theme.palette.common.white,
	},
	item: {
		paddingTop: 4,
		paddingBottom: 4,
		color: 'rgba(255, 255, 255, 0.7)',
	},
	itemCategory: {
		backgroundColor: '#232f3e',
		boxShadow: '0 -1px 0 #404854 inset',
		paddingTop: 16,
		paddingBottom: 16,
	},
	firebase: {
		fontSize: 24,
		fontFamily: theme.typography.fontFamily,
		color: theme.palette.common.white,
	},
	itemActionable: {
		'&:hover': {
			backgroundColor: 'rgba(255, 255, 255, 0.08)',
		},
	},
	itemActiveItem: {
		color: '#4fc3f7',
	},
	itemPrimary: {
		color: 'inherit',
		fontSize: theme.typography.fontSize,
		'&$textDense': {
			fontSize: theme.typography.fontSize,
		},
	},
	textDense: {},
	divider: {
		// marginTop: spacing.unit * 2,
	},
	version: {
		fontSize: 11,
		textAlign: 'center',
		fontFamily: 'arial',
		padding: 10,
		color: '#2f4058',
	},
}));

interface INavigatorProps {
	children?: any;
	role: string;
}

function Navigator(props: INavigatorProps) {
	const { role: currentRole, ...other } = props;
	const classes = useStyles();

	return (
		<Drawer variant="permanent" {...other}>
			<List disablePadding>
				<ListItem
					style={{ flexDirection: 'column' }}
					className={classNames(
						classes.firebase,
						classes.item,
						classes.itemCategory
					)}
				>
					<span style={{ fontSize: 11 }}>Roskilde Festival</span>
					Økologi Tracker
				</ListItem>

				{categories.map(({ id, roleAccess, children }) => {
					const hasAccess = roleAccess.find(
						(role) => role === currentRole
					);
					if (!hasAccess) {
						return null;
					}
					return (
						<React.Fragment key={id}>
							<ListItem className={classes.categoryHeader}>
								<ListItemText
									classes={{
										primary: classes.categoryHeaderPrimary,
									}}
								>
									{id}
								</ListItemText>
							</ListItem>
							{children.map(
								({ id: childId, icon, active, routeName }) => (
									<ListItem
										button
										dense
										key={childId}
										// tslint:disable-next-line: jsx-no-lambda
										component={(listProps: any) => (
											<Link
												routeName={routeName}
												{...listProps}
											/>
										)}
										className={classNames(
											classes.item,
											classes.itemActionable,
											active && classes.itemActiveItem
										)}
									>
										<ListItemIcon>{icon}</ListItemIcon>
										<ListItemText
											classes={{
												primary: classes.itemPrimary,
												// textDense: classes.textDense,
											}}
										>
											{childId}
										</ListItemText>
									</ListItem>
								)
							)}
							<Divider className={classes.divider} />
						</React.Fragment>
					);
				})}
			</List>
			<div className={classes.version}>v1.0.0</div>
		</Drawer>
	);
}

Navigator.propTypes = {
	PaperProps: PropTypes.any,
	variant: PropTypes.any,
	open: PropTypes.any,
	onClose: PropTypes.any,
};

export default Navigator;
