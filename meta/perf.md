# A performance check on four versions

## The four versions

|Branch|Description|How are elements moved?|Is text updated each tick?|Does selection and joins on tick?|
|---|---|---|---|---|
|[profile-a](https://github.com/jimkang/field/tree/profile-a)|Original version that locks up sometimes.|Updates groups containing circles and text elements are moved via transform.|Yes|Yes|
|[profile-b](https://github.com/jimkang/field/tree/profile-b)|Trying ungrouping *and* less text updating|Projects are ungrouped circles and foreignObjects, moving via direct attr changes|No|Yes|
|[profile-c](https://github.com/jimkang/field/tree/profile-c)|Trying ungrouping|Projects as groups of circles and foreignObjects, moving via transform|No|Yes|

## Profiling procedure






|Branch|Description|How are elements moved?|Is text updated each tick?|Does selection and joins on tick?|
|---|---|---|---|---|
|[profile-a](https://github.com/jimkang/field/tree/profile-a)|Original version that locks up sometimes.|Updates groups containing circles and text elements are moved via transform.|Yes|Yes|
|[profile-b](https://github.com/jimkang/field/tree/profile-b)|Trying ungrouping *and* less text updating|Projects are ungrouped circles and foreignObjects, moving via direct attr changes|No|Yes|
|[profile-c](https://github.com/jimkang/field/tree/profile-c)|Trying ungrouping|Projects as groups of circles and foreignObjects, moving via transform|No|Yes|
|[profile-d](https://github.com/jimkang/field/tree/profile-d)|*Only* update the transform on tick|Projects as groups of circles and foreignObjects, moving via transform|No|No|
