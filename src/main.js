import XLSX from 'xlsx';
import * as R from 'ramda';

const getElementById = (id) => document.getElementById(id);

const addEvent = R.curry((event, callback, target) => target.addEventListener(event, callback));

const addClick = addEvent('click');

const logError = (msg) => console.error(msg);

const toJson = () => {
  const $file = document.getElementById('file');
  const selectedFile = $file.files[0];
  if (!selectedFile) {
    alert('請先選擇檔案');
    return;
  }
  const reader = new FileReader();

  reader.onload = (event) => {
    const data = event?.target?.result;
    if (!data) {
      alert('資料格式錯誤');
      return;
    }

    const workbook = XLSX.read(data, {
      type: 'binary'
    });

    const outputJson = (sheetName) => {
      const row = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
      if (row.length > 0) {
        getElementById("json").innerHTML = JSON.stringify(row);
      }
    }

    R.forEach(outputJson, workbook.SheetNames)
  }

  reader.onerror = (event) => {
    logError("File could not be read! Code " + event?.target?.error?.code);
  };

  reader.readAsBinaryString(selectedFile);
}

const addToJsonEvent = R.pipe(
  getElementById,
  addClick(toJson)
);

addToJsonEvent('format');