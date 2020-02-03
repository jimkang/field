field
==================

This is your personal forces field. That is, it is a field upon you can place points that are sources of forces that you define. Then, you can add objects that those sources act upon and let them rearrange your object in 2D place.

One possible use of this app is to make a map of your projects, rearrangeable by centers of gravity you define so that, in the best case:

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

## TODO:

- Dots for projects, with callouts and labels, so that positions relative to forces can be more accurate
- Switching fields (documents)
- Field snapshots (copies of current state)
- Filtering force sources
- Dragging property sheets

## Notes on performance

These benchmarks are admittedly not perfect, but for posterity's sake, I'm writing this down. On 2020-01-23, I followed this script for these benchmarks:

- Load the page in Firefox 72.0.1.
- Zoom and pan so that all of the objects fit in the view (4 force sources and 14 projects).
- Start profiling.
- Drag around one force source four times, taking about a second for each drag. (The force sources activate the force simulation, causing the projects to move.)
- Drag a different force source one time, taking about a second for the drag.
- Stop profiling.

-------
|Approach|Average FPS|
|---|---|
|[Projects as groups of circles and foreignObjects, moving via transform](https://github.com/jimkang/field/commit/1da5ec89efb4514db49c0629c030c59e63d04184)|30.90|
|[Projects as ungrouped circles and foreignObjects, moving via direct attr changes, but also not updating text on simulation ticks](https://github.com/jimkang/field/commit/7b9970645252194f4aad8a96ecd9dfe7913cfcab)|41.22|
|[Projects as groups of circles and foreignObjects, moving via transform, but also not updating text on simulation ticks](https://github.com/jimkang/field/commit/20179dcea6099de68c0adf6af0962fe3152e9b2c)|44.77|
|[Projects as groups of circles and foreignObjects, moving via transform, and updating *only* the transform on simulation ticks](https://github.com/jimkang/field/commit/a0b3273f42db45f5e29168efa59750dd5856f03b)|49.17|

License
-------

BSD
