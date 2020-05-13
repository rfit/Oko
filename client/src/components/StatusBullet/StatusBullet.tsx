import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'inline-block',
		borderRadius: '50%',
		flexGrow: 0,
		flexShrink: 0,
	},
	sm: {
		height: theme.spacing(1),
		width: theme.spacing(1),
	},
	md: {
		height: theme.spacing(2),
		width: theme.spacing(2),
	},
	lg: {
		height: theme.spacing(3),
		width: theme.spacing(3),
	},
	primary: {
		backgroundColor: theme.palette.primary.main,
	},
	info: {
		backgroundColor: theme.palette.info.main,
	},
	warning: {
		backgroundColor: theme.palette.warning.main,
	},
	danger: {
		backgroundColor: theme.palette.error.main,
	},
	success: {
		backgroundColor: theme.palette.success.main,
	},
}));

enum StatusBulletSize {
	'sm',
	'md',
	'lg'
}
interface IStatusBullet {
	className?: string,
	color?: string; // 'primary','info','success','warning','danger',
	size?: StatusBulletSize;
}

const StatusBullet = (props: any) => {
	const { className, size, color, ...rest } = props;
	const classes = useStyles();

	return (
		<span
			{...rest}
			className={clsx(
				{
					[classes.root]: true,
					[classes[size]]: size,
					[classes[color]]: color,
				},
				className
			)}
		/>
	);
};

export default StatusBullet;
