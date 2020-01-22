var OLPE = require('one-listener-per-element');
var { on } = OLPE();
var handleError = require('handle-error-web');

var filePicker = document.getElementById('import-file');
var findAndReplaceContainer = document.getElementById(
  'find-and-replace-container'
);
var findField = document.getElementById('find-field');
var replaceField = document.getElementById('replace-field');

function wireMainControls({
  onAddProjectClick,
  onClearProjectsClick,
  onAddForceSourceClick,
  onClearForceSourcesClick,
  onExportClick,
  onImportFile,
  onFindAndReplace
}) {
  on('#add-project-button', 'click', onAddProjectClick);
  on('#clear-projects-button', 'click', onClearProjectsClick);
  on('#add-forceSource-button', 'click', onAddForceSourceClick);
  on('#clear-forceSources-button', 'click', onClearForceSourcesClick);
  on('#export-button', 'click', onExportClick);
  on('#import-file', 'change', onImportFileChange);
  on('#replace-button', 'click', onReplaceClick);
  wireReveal('#import-button', filePicker);
  wireReveal('#show-replace-button', findAndReplaceContainer);

  function onImportFileChange() {
    var file = this.files[0];
    loadFile(file);
  }

  function loadFile(file) {
    if (file && file.type.startsWith('application/json')) {
      let reader = new FileReader();
      reader.onload = passContents;
      reader.readAsText(file);
    } else {
      handleError(new Error('Invalid import file given.'));
    }
  }

  function passContents(e) {
    var parsed;
    try {
      parsed = JSON.parse(e.target.result);
    } catch (error) {
      handleError(error);
    }
    if (parsed) {
      filePicker.classList.add('hidden');
      onImportFile(parsed);
    }
  }

  function onReplaceClick() {
    var findText = findField.value;
    var replaceText = replaceField.value;
    if (findText && replaceText) {
      onFindAndReplace({ findText, replaceText });
      findAndReplaceContainer.classList.add('hidden');
    }
  }
}

function wireReveal(revealButtonSelector, elementToReveal) {
  on(revealButtonSelector, 'click', revealElement);

  function revealElement() {
    elementToReveal.classList.remove('hidden');
  }
}

module.exports = wireMainControls;
