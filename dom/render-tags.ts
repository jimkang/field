import { Thing, StringProp } from '../types';
var d3 = require('d3-selection');
var accessor = require('accessor');
var wireContentEditable = require('./wire-contenteditable');
var where = require('lodash.where');

const editTipText =
  'Hit Ctrl+Enter (or click outside of field) to complete editing. Hit Esc to cancel edit.';

export function renderTags(
  thing: Thing,
  thingType: string,
  onChange: (Thing) => void
) {
  var editor = d3.select(`#${thingType}-sheet`);
  var tagsRoot = editor.select('.tags');
  var allTags = tagsRoot
    .selectAll('.tag')
    .data(thing ? thing.tags : [], accessor());

  allTags.exit().remove();

  var newTags = allTags
    .enter()
    .append('li')
    .classed('tag', true);
  newTags
    .append('span')
    .attr('contenteditable', 'true')
    .classed('tag-actual', true)
    .each(setUpContentEditable);
  newTags
    .append('div')
    .classed('edit-field-tip', true)
    .text(editTipText);
  newTags
    .append('button')
    .text('Delete')
    .classed('tag-delete-button', true)
    .on('click', onDeleteClick);

  var survivingTags = newTags.merge(allTags);
  survivingTags.select('.tag-actual').text(accessor('value'));

  function onDeleteClick(tag: StringProp) {
    const tagIndex = where(thing.tags, { id: tag.id });
    thing.tags.splice(tagIndex, 1);
    onChange(thing);
  }

  function setUpContentEditable(tag: StringProp) {
    wireContentEditable({
      editableSelection: d3.select(this),
      initialValue: tag.value,
      onContentChanged
    });

    function onContentChanged(newValue: string) {
      tag.value = newValue;
      onChange(thing);
    }
  }
}
