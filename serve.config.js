const path = require('path');
const chokidar = require('chokidar');
const stringify = require('json-stringify-safe');
const WebSocket = require('ws');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');


// https://github.com/webpack-contrib/webpack-serve
module.exports = {
	port: 8088,
	clipboard: false,
	logLevel: 'info',
	content: [__dirname],

	// https://github.com/webpack-contrib/webpack-serve/blob/master/docs/addons/watch-content.config.js
	hotClient: {
		host: 'localhost',
		port: 8090,
	},
	on: {
		listening: (server) => {
			const socket = new WebSocket('ws://localhost:8090');
			const watchPath = __dirname;
			const options = {};
			const watcher = chokidar.watch(watchPath, options);

			watcher.on('change', () => {
				const data = {
					type: 'broadcast',
					data: {
						type: 'window-reload',
						data: {},
					},
				};

				socket.send(stringify(data));
			});

			server.server.on('close', () => {
				watcher.close();
			});
		},
	},

	// https://github.com/webpack-contrib/webpack-serve/blob/master/docs/addons/proxy-history-fallback.config.js
	add: (app, middleware, options) => {
		app.use(convert(history()));
	},
};