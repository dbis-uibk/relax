#!/usr/bin/env node
// Runs the QUnit suite of a production build in headless Firefox and exits
// non-zero if a test fails, no tests ran, or the suite does not finish in time.
//
// Usage: node helper/runBrowserTests.js [buildDir]   (default: dist)

const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');

const TIMEOUT_MS = 120000;
const PUBLIC_PATH = '/relax/'; // see output.publicPath in webpack.config.js
const CONTENT_TYPES = { '.css': 'text/css', '.html': 'text/html', '.js': 'text/javascript' };

const buildDir = path.resolve(process.argv[2] || path.join(__dirname, '..', 'dist'));
const testPage = path.join(buildDir, 'test.html');

if (!fs.existsSync(testPage)) {
	console.error(`${testPage} not found, create it with yarn build first`);
	process.exit(1);
}

// test.html has no reporting of its own, so this reports back to the server below
const REPORTER = `<script>
	var failures = [];
	QUnit.log(function (d) {
		if (!d.result) {
			failures.push({ test: d.module + ' > ' + d.name, message: d.message, expected: String(d.expected), actual: String(d.actual) });
		}
	});
	QUnit.done(function (summary) {
		fetch('/__results', { method: 'POST', body: JSON.stringify({ summary: summary, failures: failures }) });
	});
</script>`;

const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'relax-tests-'));
let firefox;
let server;

function finish(exitCode, message) {
	(exitCode === 0 ? console.log : console.error)(message);
	if (firefox) {
		firefox.kill();
	}
	if (server) {
		server.close();
	}
	// firefox may still be writing to its profile while it shuts down
	fs.rmSync(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
	process.exit(exitCode);
}

function reportResults({ summary, failures }) {
	for (const { test, message, expected, actual } of failures) {
		console.error(`FAILED ${test}\n  ${message}\n  expected: ${expected}\n  actual:   ${actual}`);
	}
	const line = `${summary.passed} of ${summary.total} assertions passed in ${summary.runtime} ms`;
	if (summary.total === 0) {
		finish(1, 'no tests were run');
	}
	finish(summary.failed === 0 ? 0 : 1, line);
}

function serveFile(request, response) {
	const urlPath = request.url.split('?')[0];
	const relativePath = urlPath.startsWith(PUBLIC_PATH) ? urlPath.slice(PUBLIC_PATH.length) : urlPath.slice(1);
	const file = path.join(buildDir, relativePath);

	if (!file.startsWith(buildDir + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
		response.statusCode = 404;
		response.end();
		return;
	}

	response.setHeader('Content-Type', CONTENT_TYPES[path.extname(file)] || 'application/octet-stream');
	response.end(
		file === testPage
			? fs.readFileSync(file, 'utf8').replace('</body>', `${REPORTER}</body>`)
			: fs.readFileSync(file),
	);
}

server = http.createServer((request, response) => {
	if (request.url !== '/__results') {
		serveFile(request, response);
		return;
	}

	let body = '';
	request.on('data', chunk => { body += chunk; });
	request.on('end', () => {
		response.end();
		reportResults(JSON.parse(body));
	});
});

server.listen(0, '127.0.0.1', () => {
	const url = `http://127.0.0.1:${server.address().port}${PUBLIC_PATH}test.html`;

	firefox = spawn('firefox', ['--headless', '--no-remote', '--profile', profileDir, url], { stdio: 'ignore' });
	firefox.on('error', error => finish(1, `could not start firefox: ${error.message}`));
	setTimeout(() => finish(1, `tests did not finish within ${TIMEOUT_MS / 1000}s`), TIMEOUT_MS);
});
