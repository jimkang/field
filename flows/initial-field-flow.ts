import { Store } from '../store';
import { createNewField } from '../tasks/create-new-field';
import { FieldStoreDone } from '../types';
var oknok = require('oknok');
var VError = require('verror');

function initialFieldFlow(
  { fieldId }: { fieldId: string },
  done: FieldStoreDone
) {
  var store = Store();

  if (fieldId) {
    loadField(fieldId);
  } else {
    store.getFieldNames(
      oknok({
        ok: loadOrCreateField,
        nok: error =>
          done(VError(error, 'Could not get field names. Try reloading?'))
      })
    );
  }

  function loadOrCreateField(
    fieldIdNamesAndIds: Array<Record<string, string>>
  ) {
    if (fieldIdNamesAndIds.length > 0) {
      loadField(fieldIdNamesAndIds[0].id);
    } else {
      createNewField({ store, forceSources: {}, projects: {} }, done);
    }
  }

  function loadField(fieldId: string) {
    store.loadField(
      { field: fieldId },
      oknok({
        ok: result => done(null, result),
        nok: error =>
          done(
            VError(
              error,
              'Could not load the fieldId named %s. Try reloading?',
              fieldId
            )
          )
      })
    );
  }
}

module.exports = initialFieldFlow;
