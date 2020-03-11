import { Store } from '../store';
import { createNewField } from '../tasks/create-new-field';
import { FieldStoreDone } from '../types';

function initialFieldFlow(
  { db, fieldId }: { db: object; fieldId: string },
  done: FieldStoreDone
) {
  var store = Store({ db });

  store.getFieldNames(onFieldNamesGet);

  function onFieldNamesGet(
    error: Error,
    fieldNamesAndIds: Array<Record<string, string>>
  ) {
    if (error) {
      loadOrCreateField([]);
    } else {
      loadOrCreateField(fieldNamesAndIds);
    }
  }

  function loadOrCreateField(fieldNamesAndIds: Array<Record<string, string>>) {
    // If there's field ids, this is an initialized
    // database, and we should try to load the specified
    // field. If not, we should create one.
    if (fieldNamesAndIds.length > 0) {
      if (fieldId) {
        store.loadField({ fieldId }, onFieldLoad);
      } else {
        // TODO: Look at ordering of fieldNamesAndIds.
        store.loadField({ fieldId: fieldNamesAndIds[0]._id }, onFieldLoad);
      }
    } else {
      createNewField(
        { store, forceSources: {}, projects: {} },
        completeIgnoringError
      );
    }
  }

  function onFieldLoad(error: Error, result) {
    if (error) {
      done(null, {
        store,
        message: `Could not load the field with the id ${fieldId}. Try picking another field?`
      });
    } else {
      done(null, result);
    }
  }

  function completeIgnoringError(error, result) {
    if (error) {
      console.error(error, error.stack);
    }
    done(null, result);
  }
}

module.exports = initialFieldFlow;
