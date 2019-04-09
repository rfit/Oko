import { Router } from 'router5/types';

import createRouter from 'router5';
import loggerPlugin from 'router5-plugin-logger';
import browserPlugin from 'router5-plugin-browser';
import routes from './routes';

const configureRouter: (options?: {
	listener: boolean
	logger: boolean
  }) => Router = (options = { listener: false, logger: false }) => {
	const router = createRouter(routes, {
		defaultRoute: 'overview'
	})

	router.usePlugin(browserPlugin())

	// if (options.listener) router.usePlugin(listenersPlugin())

	// if (options.logger) router.usePlugin(loggerPlugin)

	return router
  }

  export default configureRouter

