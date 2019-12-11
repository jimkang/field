import { Thing, ThingType } from '../types';
var cloneDeep = require('lodash.clonedeep');
var StrokeRouter = require('strokerouter');
var d3 = require('d3-selection');
import { renderProps } from './render-props';

var strokeRouter = StrokeRouter(document);

export function renderEditor({
  thing,
  thingType,
  onChange,
  onAddProp
}: {
  thing: Thing;
  thingType: ThingType;
  onChange: (Thing) => void;
  onAddProp: (Thing) => void;
}) {
  var editor = d3.select(`.${thingType}-editor`);
  editor.classed('hidden', !thing);
  d3.select(`.${thingType}-editor`).classed('hidden', !thing);
  if (!thing) {
    return;
  }

  renderNameField(thing, thingType, onNameChanged);
  renderProps(thing, thingType, onChange);
  editor.select('.add-prop-button').on('click', onAddPropClick);

  function onNameChanged(newText) {
    var copy = cloneDeep(thing);
    copy.name = newText;
    onChange(copy);
  }

  function onAddPropClick() {
    onAddProp(thing);
  }
}

function renderNameField(
  thing: Thing,
  thingType: ThingType,
  onNameChanged: (string) => void
) {
  var nameField = d3.select(`.${thingType}-editor .name`);
  var editing = false;
  var initialValue = '';

  // Disconnect old event listeners.
  nameField.on('blur.name', null);
  nameField.on('click.name', null);
  strokeRouter.unrouteKeyUp('escape', null);
  strokeRouter.unrouteKeyUp('enter', ['ctrl']);
  strokeRouter.unrouteKeyUp('enter', ['meta']);

  // Update field value.
  nameField.text(thing ? thing.name : '');
  if (!thing) {
    return;
  }

  // Connect current listeners.
  nameField.on('blur.name', endEditing);
  nameField.on('click.name', startEditing);

  strokeRouter.routeKeyUp('escape', null, cancelEditing);
  strokeRouter.routeKeyUp('enter', ['ctrl'], endEditing);
  strokeRouter.routeKeyUp('enter', ['meta'], endEditing);

  function startEditing() {
    nameField.classed('editing', true);
    initialValue = nameField.text();
    editing = true;
  }

  function endEditing() {
    if (editing) {
      nameField.classed('editing', false);
      onNameChanged(nameField.text());
      editing = false;
    }
  }

  function cancelEditing() {
    if (editing) {
      nameField.classed('editing', false);
      nameField.text(initialValue);
      editing = false;
    }
  }
}
