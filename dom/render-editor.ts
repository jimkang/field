import { Thing, ThingType } from '../types';
var cloneDeep = require('lodash.clonedeep');
var d3 = require('d3-selection');
import { renderProps } from './render-props';
var wireContentEditable = require('./wire-contenteditable');

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

  wireContentEditable({
    editableSelection: d3.select(`.${thingType}-editor .name`),
    initialValue: thing.name,
    onContentChanged: onNameChanged
  });

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
