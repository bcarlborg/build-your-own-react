# =================================================================
# Variables
# =================================================================

# SRC_JS is a variable that contains all the javascript files in the src directory
# as a space separated list of filenames. These file names are identified by the
# wildcard make function which looks for files ending with `.js` in the `src/` directory
SRC_JS = $(wildcard src/*.js)

# DIST_JS is a variable that contains all the javascript files in the dist directory
# as a space separated list of filenames. These are the JS file that our build process
# creates. We derive this list of file names by taking each filename in `SRC_JS` and
# replacing the `src/` prefix with the `dist/` prefix.
DIST_JS = $(SRC_JS:src/%.js=dist/%.js)

# SRC_HTML is a variable that contains all the html files in the src directory
# as a space separated list of filenames. These file names are identified by the
# wildcard make function which looks for files ending with `.html` in the `src/` directory
SRC_HTML = $(wildcard src/*.html)

# DIST_HTML is a variable that contains all the html files in the dist directory
# as a space separated list of filenames. These are the html file that our build process
# creates. We derive this list of file names by taking each filename in `SRC_HTML` and
# replacing the `src/` prefix with the `dist/` prefix.
DIST_HTML = $(SRC_HTML:src/%.html=dist/%.html)


# DIST_FILES is a variable that contains all the files in the dist directory
# that we want our build process to create.
DIST_FILES = $(DIST_JS) $(DIST_HTML)

# =================================================================
# Rules
# =================================================================

# The build rule is a phony rule. It is phony because even though the
# target of the rule is called build, it doesn't actually create a file called build.
# Make calls rules that have this pattern phony rules.
# By running `make build`, we are telling make to execute the rules for every file in $(DIST_FILES).
.PHONY: build
build: $(DIST_FILES)

# The serve rule is a phony rule. It is phony because even though the
# target of the rule is called serve, it doesn't actually create a file called serve.
# Make calls rules that have this pattern phony rules.
# By running `make serve`, we are telling make to execute the rules for every file in $(DIST_FILES)
# and to start a python server on port 8080 that serves the files in the dist directory.
.PHONY: serve
serve: $(DIST_FILES)
	python3 -m http.server -d ./dist 8080

make clean:
	rm -rf dist/*

# The rule for creating the html files in the dist directory.
# The `$(@D)` is an automatic make variable that returns the directory part of the target.
dist/%.html: src/%.html
	mkdir -p $(@D)
	cp $< $@

# The rule for creating the js files in the dist directory.
dist/%.js: src/%.js babel.config.json
	mkdir -p $(@D)
	npx babel $< -o $@