SRC_JS = $(wildcard src/*.js)
DIST_JS = $(SRC_JS:src/%.js=dist/%.js)

SRC_HTML = $(wildcard src/*.html)
DIST_HTML = $(SRC_HTML:src/%.html=dist/%.html)

# All files in the dist directory
DIST = $(DIST_JS) $(DIST_HTML)

.PHONY: dist serve
dist: $(DIST)

serve: $(DIST)
	python3 -m http.server -d ./dist 8080

dist/%.html: src/%.html
	mkdir -p $(@D)
	cp $< $@

dist/%.js: src/%.js babel.config.json
	mkdir -p $(@D)
	npx babel $< -o $@