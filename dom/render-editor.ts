import { Thing, ThingType } from '../types';
var cloneDeep = require('lodash.clonedeep');
var d3 = require('d3-selection');
import { renderProps } from './render-props';
var wireContentEditable = require('./wire-contenteditable');

export function renderEditor({
  thing,
  thingType,
  onChange,
  onAddProp,
  onDeleteThing,
  visible
}: {
  thing: Thing;
  thingType: ThingType;
  onChange: (Thing) => void;
  onAddProp: (Thing) => void;
  onDeleteThing: (Thing) => void;
  visible: boolean;
}) {
  var editor = d3.select(`.${thingType}-editor`);
  editor.classed('hidden', visible);
  d3.select(`.${thingType}-editor`).classed('hidden', !visible);
  if (!thing) {
    return;
  }

  wireContentEditable({
    editableSelection: d3.select(`.${thingType}-editor .name`),
    initialValue: thing.name,
    onContentChanged: onNameChanged
  });

  renderProps(thing, thingType, onChange);
  editor.select('.add-prop-button').on('click', onAddPropClick);
  editor.select('.delete-button').on('click', onDeleteClick);

  function onNameChanged(newText) {
    var copy = cloneDeep(thing);
    copy.name = newText;
    onChange(copy);
  }

  function onAddPropClick() {
    onAddProp(thing);
  }

  function onDeleteClick() {
    // TODO: Confirmation
    onDeleteThing(thing);
  }
}
