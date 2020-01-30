var thingDefaults = {
  lastUpdated: new Date(),
  numberProps: [],
  created: new Date(),
  tags: [],
  x: 0,
  y: 0
};

// Fill in as the schema updates.
var projectDefaults = {
  thingType: 'project'
};

var forceSourceDefaults = {
  thingType: 'forceSource'
};

module.exports = { thingDefaults, projectDefaults, forceSourceDefaults };
