import { Thing, NumberProp } from '../types';
var d3 = require('d3-selection');
var accessor = require('accessor');
var wireContentEditable = require('./wire-contenteditable');

export function renderProps(
  thing: Thing,
  thingType: string,
  onChange: (Thing) => void
) {
  var editor = d3.select(`#${thingType}-sheet`);
  var propsRoot = editor.select('.props');
  var allProps = propsRoot
    .selectAll('.prop')
    .data(thing ? thing.numberProps : [], accessor('name'));

  allProps.exit().remove();

  var newProps = allProps
    .enter()
    .append('li')
    .classed('prop', true);
  newProps
    .append('h3')
    .attr('contenteditable', 'true')
    .classed('prop-label', true)
    .each(setUpContentEditable);
  newProps
    .append('input')
    .classed('prop-slider', true)
    .attr('type', 'range')
    .attr('min', '0.0')
    .attr('max', '1.0')
    .attr('step', '0.05')
    .on('change', onValueChange);
  newProps
    .append('input')
    .classed('prop-val', true)
    .attr('type', 'number')
    .attr('min', '0.0')
    .attr('max', '1.0')
    .attr('step', '0.05')
    .on('change', onValueChange);

  var survivingProps = newProps.merge(allProps);
  survivingProps.select('.prop-label').text(accessor('name'));
  survivingProps.select('.prop-slider').attr('value', accessor('value'));
  survivingProps.select('.prop-val').attr('value', accessor('value'));

  function onValueChange(numberProp: NumberProp) {
    numberProp.value = this.value;
    onChange(thing);
  }

  function setUpContentEditable(numberProp: NumberProp) {
    wireContentEditable({
      editableSelection: d3.select(this),
      initialValue: numberProp.name,
      onContentChanged
    });

    function onContentChanged(newValue: string) {
      numberProp.name = newValue;
      onChange(thing);
    }
  }
}
