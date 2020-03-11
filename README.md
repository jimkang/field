field
==================

This is your personal forces field. That is, it is a field upon you can place points that are sources of forces that you define. Then, you can add objects that those sources act upon and let them rearrange your object in 2D place.

One possible use of this app is to make a map of your projects, rearrangeable by centers of gravity you define so that, in the best case:

- You won't lose sight of stuff.
- You'll be able to pick the best thing to do.
- You'll see relationships between them.
- You won't be overwhelmed or saddened.

In the worst case, it'll be a bunch of your project names in shapes, arranged in 2D, so that at least it won't be this oppressively long list.

## TODO

- Test import and export

Installation
------------

First, install Node. Then:

    npm install
    npm install wzrd -g

Usage
-----

    make run

Then, wzrd will say something like:

    wzrd index.js
    server started at http://localhost:9966

You can open your browser to that.

Run `make prettier` (expects you to have run `npm install -g prettier`) and `eslint .` before committing.

Run `make build` to build the index.js.

## Tests

Run tests with `make test`. Run tests with the debugger with `make debug-test`.

## TODO:

- Dots for projects, with callouts and labels, so that positions relative to forces can be more accurate
- Switching fields (documents)
- Field snapshots (copies of current state)
- Filtering force sources
- Dragging property sheets

License
-------

BSD
