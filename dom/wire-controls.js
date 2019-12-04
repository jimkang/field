var OLPE = require('one-listener-per-element');
var { setListener } = OLPE();

function wireControls({ onAddProjectClick, onClearClick }) {
  setListener({
    eventName: 'click',
    listener: onAddProjectClick,
    element: document.getElementById('add-project-button')
  });
  setListener({
    eventName: 'click',
    listener: onClearClick,
    element: document.getElementById('clear-button')
  });
}

module.exports = wireControls;
