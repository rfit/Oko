import * as React from 'react';

const ErrorView = (props: any) => {
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
