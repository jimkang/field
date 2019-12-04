workings
==================

It's a map of your projects, rearrangeable by centers of gravity you define so that, in the best case:

- You won't lose sight of stuff.
- You'll be able to pick the best thing to do.
- You'll see relationships between them.
- You won't be overwhelmed or saddened.

In the worst case, it'll be a bunch of your project names in shapes, arranged in 2D, so that at least it won't be this oppressively long list.

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

License
-------

BSD

