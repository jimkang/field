var Crown = require('csscrown');
var crown = Crown({
  crownClass: 'active'
});
var OLPE = require('one-listener-per-element');
var { on } = OLPE();

function renderTopLevelToggles() {
  on('#toggle-forceSource-controls', 'click', onToggleClick);
  on('#toggle-project-controls', 'click', onToggleClick);
  on('#toggle-field-controls', 'click', onToggleClick);

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

module.exports = renderTopLevelToggles;
