all: browserify

browserify:
	browserify build.js --standalone sfz > build/sfz.js

test: browserify test_node test_client

test_node:
	@./node_modules/.bin/mocha --reporter dot

test_node_ci:
	@./node_modules/.bin/mocha --reporter dot --watch

test_client: browserify
	@./node_modules/karma/bin/karma start --single-run

test_client_ci: browserify
	@./node_modules/karma/bin/karma start --no-single-run

.PHONY: test
