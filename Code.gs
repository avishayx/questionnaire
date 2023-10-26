var SPREADSHEET_ID = '1xWf2GaprQBNDK72HpwaYuPu_AR-r2odJgFImDXMmNuA';
var SHEET_NAME = 'Sheet1';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Page1');
}

// var state = {
//   currentStep: 'phoneNumber', // initial step
//   phoneNumber: '',
//   selectedNames: [],
//   answers: []
// };

function getNamesByPhoneNumber(phoneNumber) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  var data = sheet.getDataRange().getValues();
  var matchedRows = [];

  data.forEach(function(row) {
    if (row[2] == phoneNumber) {
      matchedRows.push({ firstName: row[0], lastName: row[1] });
    }
  });

  return matchedRows;
}



function recordAnswersInSpreadsheet(answers) {
  var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

  answers.forEach(function(answer) {
    var name = answer.name;
    var responses = answer.responses;

    responses.forEach(function(response, index) {
      var lastColumn = sheet.getLastColumn();
      var headerRange = sheet.getRange(1, 1, 1, lastColumn).getValues();
      var columnIndex = headerRange[0].indexOf(response.question);

      if (columnIndex === -1) {
        columnIndex = lastColumn;
        sheet.getRange(1, columnIndex + 1).setValue(response.question);
      }

      var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
      var rowIndex = -1; 
      for (var i = 0; i < data.length; i++) {
        if (data[i][0] == name) {
          rowIndex = i + 2;
          break;
        }
      }

      if (rowIndex === -1) {
        rowIndex = sheet.getLastRow() + 1;
        sheet.getRange(rowIndex, 1).setValue(name);
      }

      sheet.getRange(rowIndex, columnIndex + 1).setValue(response.answer);
    });
  });
}


