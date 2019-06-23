import * as React from 'react';

interface IErrorViewProps {
	error: IError;
}
interface IError {
	message: string;
}

const ErrorView = (props: IErrorViewProps) => {
	return (
		<div>
			<h1>Ups. Der opstod en fejl.</h1>
			<p>
				<pre>{props.error.message}</pre>
			</p>
		</div>
	)
}

export default ErrorView;
