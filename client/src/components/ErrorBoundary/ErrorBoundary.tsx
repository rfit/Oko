import * as React from 'react';

class ErrorBoundary extends React.Component<any,any> {
	public static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true, errMsg: error.message };
	}

	constructor(props: any) {
	  super(props);
	  this.state = { hasError: false, errMsg: '' };
	}

	public render() {
	  if (this.state.hasError) {
		// You can render any custom fallback UI
		return (
			<>
				<h1>Noget gik galt.</h1>
				<p>{this.state.errMsg}</p>
			</>
		);
	  }

	  return this.props.children;
	}
}

export default ErrorBoundary;
