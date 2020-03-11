require('longjohn');
var test = require('tape');
var assertNoError = require('assert-no-error');

var initialFieldFlow = require('../flows/initial-field-flow.ts');
var PouchDB = require('pouchdb');

var testCases = [
  {
    name: 'Nothing in db yet, so it initializes with a field',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: true,
    opts: {
      fieldId: 'smidgeo-field'
    }
  },
  {
    name: 'No fieldId provided, so it returns a store, and a recent field',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: true,
    opts: {}
  },
  {
    name: 'Field is in db but not the one with the requested id',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: false,
    expectedMessage:
      'Could not load the field with the id nonexistent-field. Try picking another field?',
    opts: {
      fieldId: 'nonexistent-field'
    }
  },
  {
    name: 'Field is in db',
    dbName: 'db-a',
    expectError: false,
    expectStore: true,
    expectFieldStore: false,
    expectedFieldStoreId: 'smidgeo-field',
    opts: {
      fieldId: 'smidgeo-field'
    }
  }
];

testCases.forEach(runCase);

function runCase(testCase) {
  test(testCase.name, runTest);

  function runTest(t) {
    var db = new PouchDB('tests/fixtures/test-' + testCase.dbName);
    initialFieldFlow(Object.assign({ db }, testCase.opts), checkResult);

    function checkResult(error, result) {
      if (testCase.expectError) {
        t.ok(error, 'Flow calls back with error.');
      } else {
        assertNoError(t.ok, error, 'No error while running flow.');
      }

      if (testCase.expectStore) {
        t.equal(
          typeof result.store.loadField,
          'function',
          'store is provided by flow.'
        );
      }
      if (testCase.expectFieldStore) {
        t.equal(
          typeof result.fieldStore.saveAll,
          'function',
          'fieldStore is provided by flow.'
        );
        if (testCase.expectedFieldStoreFieldId) {
          t.equal(
            result.fieldStore.getFieldId(),
            result.fieldStoreFieldId,
            'Id of field is correct.'
          );
        }
      }
      if (testCase.expectedMessage) {
        t.equal(
          result.message,
          testCase.expectedMessage,
          'Expected message is provided.'
        );
      }
      t.end();
    }
  }
}
