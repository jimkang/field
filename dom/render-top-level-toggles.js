var Crown = require('csscrown');
var crown = Crown({
  crownClass: 'active'
});
var OLPE = require('one-listener-per-element');
var { on } = OLPE();

var projectToggleButton = document.querySelector(
  '#toggle-project-controls .display-area'
);
var forceSourceToggleButton = document.querySelector(
  '#toggle-forceSource-controls .display-area'
);

function renderTopLevelToggles({ selProj, selAttr }) {
  on('#toggle-forceSource-controls', 'click', onToggleClick);
  on('#toggle-project-controls', 'click', onToggleClick);
  on('#toggle-field-controls', 'click', onToggleClick);

  if (selProj) {
    callAttnToEl(projectToggleButton);
  }
  if (selAttr) {
    callAttnToEl(forceSourceToggleButton);
  }

  function onToggleClick(e) {
    var sheet = document.getElementById(e.target.dataset.sheet);
    if (!sheet) {
      return;
    }

    if (sheet.classList.contains('active')) {
      sheet.classList.remove('active');
    } else {
      crown(sheet);
    }
  }
}

function callAttnToEl(el) {
  el.classList.add('call-attn');
  setTimeout(() => el.classList.remove('call-attn'), 3000);
}

module.exports = renderTopLevelToggles;
