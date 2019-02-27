import * as React from 'react';

import { createStyles, Theme, withStyles } from '@material-ui/core/styles';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';

const styles = ({ palette, spacing, breakpoints, mixins }: Theme) => createStyles({
	root: {
		flexGrow: 1,
	  },
	  grow: {
		flexGrow: 1,
	  },
	  menuButton: {
		marginLeft: -12,
		marginRight: 20,
	  },
});

interface IHeaderState {
	auth: boolean;
	admin: boolean;
	anchorEl: any;
}

interface IHeaderProps {
	classes: any;
}

class Header extends React.Component<IHeaderProps, IHeaderState> {
	public state: Readonly<IHeaderState> = {
		auth: true,
		admin: true,
		anchorEl: ''
	};

	public handleChange = (event: any) => {
		this.setState({ auth: event.target.checked });
	};

	public handleMenu = (event: any) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	public handleClose = () => {
		this.setState({ anchorEl: null });
	};
	public render() {
		const {
			classes
		} = this.props;
		const { auth, anchorEl } = this.state;
		const open = Boolean(anchorEl);

		return (
			<AppBar position="static">
				<Toolbar>
					<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit" className={classes.grow}>
						ØkoApp
					</Typography>
					{auth && (
						<div>
							<IconButton
								aria-owns={open ? 'menu-appbar' : undefined}
								aria-haspopup="true"
								onClick={this.handleMenu}
								color="inherit"
							>
								<AccountCircle />
							</IconButton>
							<Menu
								id="menu-appbar"
								anchorEl={anchorEl}
								anchorOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								transformOrigin={{
									vertical: 'top',
									horizontal: 'right',
								}}
								open={open}
								onClose={this.handleClose}
							>
							<MenuItem onClick={this.handleClose}>Profile</MenuItem>
							<MenuItem onClick={this.handleClose}>My account</MenuItem>
							</Menu>
						</div>
						)}
				</Toolbar>
			</AppBar>
		);
	}
};

export default withStyles(styles)(Header);
