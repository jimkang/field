include config.mk

HOMEDIR = $(shell pwd)
BROWSERIFY = ./node_modules/.bin/browserify
UGLIFY = ./node_modules/uglify-es/bin/uglifyjs
TRANSFORM_SWITCH = -t [ babelify --presets [ es2015 ] --extensions ['.ts'] ]
PLUGIN_SWITCH = -p [tsify]

pushall: sync
	git push origin master

deploy:
	make build && git commit -a -m"Build" && make pushall

run:
	wzrd app.js:index.js -- \
		-d \
		$(PLUGIN_SWITCH)

build:
	$(BROWSERIFY) $(PLUGIN_SWITCH) app.js | $(UGLIFY) -c -m -o index.js

prettier:
	prettier --single-quote --write "**/*.html"

test:
	rm -rf tests/fixtures/*
	node -r ts-node/register tests/initial-field-flow-tests.js

debug-test:
	rm -rf tests/fixtures/*
	node inspect -r ts-node/register tests/initial-field-flow-tests.js

sync:
	rsync -a $(HOMEDIR)/ $(USER)@$(SERVER):/$(APPDIR) \
    --exclude node_modules/ \
		--exclude .git \
    --omit-dir-times \
    --no-perms

set-up-server-dir:
	ssh $(USER)@$(SERVER) "mkdir -p $(APPDIR)"
