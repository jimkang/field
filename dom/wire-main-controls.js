var OLPE = require('one-listener-per-element');
var { on } = OLPE();
var handleError = require('handle-error-web');

var filePicker = document.getElementById('import-file');

function wireMainControls({
  onAddProjectClick,
  onClearProjectsClick,
  onAddForceSourceClick,
  onClearForceSourcesClick,
  onExportClick,
  onImportFile
}) {
  on('#add-project-button', 'click', onAddProjectClick);
  on('#clear-projects-button', 'click', onClearProjectsClick);
  on('#add-forceSource-button', 'click', onAddForceSourceClick);
  on('#clear-forceSources-button', 'click', onClearForceSourcesClick);
  on('#export-button', 'click', onExportClick);
  on('#import-button', 'click', revealFilePicker);
  on('#import-file', 'change', onImportFileChange);

  function revealFilePicker() {
    filePicker.classList.remove('hidden');
  }

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
}

module.exports = wireMainControls;
