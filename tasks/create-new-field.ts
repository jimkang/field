import { FieldStoreDone } from '../types';
var oknok = require('oknok');
var VError = require('verror');

var randomId = require('@jimkang/randomid')();

export function createNewField(
  { store, forceSources, projects },
  done: FieldStoreDone
) {
  store.createField(
    {
      name: createFieldName(),
      _id: createFieldId(),
      forceSources,
      projects
    },
    oknok({
      ok: result => done(null, result),
      nok: error =>
        done(VError(error, 'Could not create a field! Try reloading?'))
    })
  );
}

function createFieldName() {
  return `A cool new field of stuff ${randomId(4)}`;
}

function createFieldId() {
  return `field-${randomId(4)}`;
}
