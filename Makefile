tests:
	./node_modules/.bin/eslint --fix-dry-run .
	./node_modules/.bin/prettier -cl .

lint: fix-eslint fix-prettier

fix-eslint:
	./node_modules/.bin/eslint --fix .

fix-prettier:
	./node_modules/.bin/prettier -w .
