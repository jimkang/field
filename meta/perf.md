# A performance probe on four versions of this app

A journey into maddening non-determinism that sometimes yields clues.

>  A good statistician will point out that causality can be proven only by demonstrating a mechanism. Statistics alone can never prove causality, but it can show you where to look. Perhaps no example better illustrates this than smoking and cancer/heart disease. Despite all of the statistical evidence, the causal relationship between smoking and disease will not be nailed down by the numbers but by the identification of the substance in tobacco that trigger the diseases.
—[Gerald E. Dallal]

## The four versions

|Branch|Description|How are elements moved?|Is text updated each tick?|Does selection and joins on tick?|
|---|---|---|---|---|
|[profile-a](https://github.com/jimkang/field/tree/profile-a)|Original version that locks up sometimes.|Updates groups containing circles and text elements are moved via transform.|Yes|Yes|
|[profile-b](https://github.com/jimkang/field/tree/profile-b)|Trying ungrouping *and* less text updating|Projects are ungrouped circles and foreignObjects, moving via direct attr changes|No|Yes|
|[profile-c](https://github.com/jimkang/field/tree/profile-c)|Trying ungrouping|Projects as groups of circles and foreignObjects, moving via transform|No|Yes|

## Profiling procedure

- Load the page in Firefox
- Zoom and pan so that all of the objects fit in the view (5 force sources and y projects).
- Start profiling.
- Click on the app window.
- Drag a force source around, then release.
- Repeat above.
- Stop profiling.
- Go to the flame chart.
- Note the Min. FPS.


|Branch|Description|How are elements moved?|Is text updated each tick?|Does selection and joins on tick?|Min FPS.
|---|---|---|---|---|---|
|[profile-a](https://github.com/jimkang/field/tree/profile-a)|Original version that locks up sometimes.|Updates groups containing circles and text elements are moved via transform.|Yes|Yes|?|
|[profile-b](https://github.com/jimkang/field/tree/profile-b)|Trying ungrouping *and* less text updating|Projects are ungrouped circles and foreignObjects, moving via direct attr changes|No|Yes|?|
|[profile-c](https://github.com/jimkang/field/tree/profile-c)|Trying ungrouping|Projects as groups of circles and foreignObjects, moving via transform|No|Yes|?|
|[profile-d](https://github.com/jimkang/field/tree/profile-d)|*Only* update the transform on tick|Projects as groups of circles and foreignObjects, moving via transform|No|No|?|
