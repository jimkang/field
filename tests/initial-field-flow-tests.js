var test = require('tape');
var assertNoError = require('assert-no-error');

var initialFieldFlow = require('../flows/initial-field-flow.ts');
var PouchDB = require('pouchdb');

test('Flow with nothing in db yet', emptyDbTest);

function emptyDbTest(t) {
  var db = new PouchDB('fields-db');
  initialFieldFlow({ db, fieldId: 'field-test' }, checkResult);

  function checkResult(error, result) {
    assertNoError(t.ok, error, 'No error while running flow.');
    t.equal(
      typeof result.store.loadField,
      'function',
      'store is provided by flow.'
    );
    t.equal(
      typeof result.fieldStore.saveAll,
      'function',
      'fieldStore is provided by flow.'
    );
    t.end();
  }
}
