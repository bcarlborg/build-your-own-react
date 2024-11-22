# Build Your Own Make

I am using this repository to hold my implementation of the code in the (amazing) tutorial, [Build Your Own React](https://pomb.us/build-your-own-react/) by Rodrigo Pombo.

## Running the code in the repository

This project requires you have npm and python3 installed on your machine.

The basic setup of the project is that the `src/` directory contains the javascript we write in the project. The `dist/` directory contains the transpiled code and html that is output on the webpage.

Commands to use in this repo:

- `make install`: install the necessary node modules (runs `npm i`)
- `make build`: To run babel and convert the js and html in `src/` to the servable html and js in `dist/` run
- `make serve`: To start a simple http server that serves the content in `dist/` at [http://[::]:8080/](http://[::]:8080/)
- `make clean`: to clear the `dist/` directory
