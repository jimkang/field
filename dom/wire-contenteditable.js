var StrokeRouter = require('strokerouter');
var d3 = require('d3-selection');

function wireContentEditable({
  editableSelection,
  initialValue,
  onContentChanged
}) {
  var editing = false;
  var strokeRouter = StrokeRouter(editableSelection.node(), d3);

  // Disconnect old event listeners.
  editableSelection.on('blur.name', null);
  editableSelection.on('click.name', null);
  editableSelection.on('keyup.name', null);

  // Update field value.
  editableSelection.text(initialValue);

  // Connect current listeners.
  editableSelection.on('blur.name', endEditing);
  editableSelection.on('click.name', startEditing);
  editableSelection.on('keyup.name', strokeRouter.onKeyUpD3);

  strokeRouter.routeKeyUp('escape', null, cancelEditing);
  strokeRouter.routeKeyUp('enter', ['ctrl'], blur);
  strokeRouter.routeKeyUp('enter', ['meta'], blur);

  function startEditing() {
    editableSelection.classed('editing', true);
    initialValue = editableSelection.text();
    editing = true;
  }

  function endEditing() {
    if (editing) {
      editableSelection.classed('editing', false);
      console.log('end editing', editableSelection.text());
      onContentChanged(editableSelection.text());
      editing = false;
    }
  }

  function cancelEditing() {
    if (editing) {
      editableSelection.classed('editing', false);
      editableSelection.text(initialValue);
      editing = false;
      blur();
    }
  }

  function blur() {
    editableSelection.node().blur();
  }
}

module.exports = wireContentEditable;
