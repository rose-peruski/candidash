var google = require('googleapis');
var googleAuth = require('google-auth-library');
var util = require('util');

var SheetsHelper = function(accessToken) {
  var authClient = new googleAuth();
  var auth = new authClient.OAuth2();
  auth.credentials = {
    access_token: accessToken
  };
  this.service = google.sheets({version: 'v4', auth: auth});
};

module.exports = SheetsHelper;

// SheetsHelper.prototype.createSpreadsheet = function(title, callback) {
//   var self = this;
//   var request = {
//     resource: {
//       properties: {
//         title: title
//       },
//       sheets: [
//         {
//           properties: {
//             title: 'Data',
//             gridProperties: {
//               columnCount: 6,
//               frozenRowCount: 1
//             }
//           }
//         },
//         // TODO: Add more sheets.
//
//
//       ]
//     }
//   };
//   self.service.spreadsheets.create(request, function(err, spreadsheet) {
//     if (err) {
//       return callback(err);
//     }
//     // TODO: Add header rows.
//     var dataSheetId = spreadsheet.sheets[0].properties.sheetId;
// var requests = [
// buildHeaderRowRequest(dataSheetId),
// ];
// // TODO: Add pivot table and chart.
//     var request = {
//     spreadsheetId: spreadsheet.spreadsheetId,
//     resource: {
//       requests: requests
//     }
//     };
//
//     self.service.spreadsheets.batchUpdate(request, function(err, response) {
//     if (err) {
//       return callback(err);
//     }
//     return callback(null, spreadsheet);
//     });
//
//       });
//     };

    var COLUMNS = [
  { field: 'item', header: 'Item' },
  { field: 'income', header: 'Income'},
  { field: 'expenses', header: 'Expenses' },

];

function buildHeaderRowRequest(sheetId) {
  var cells = COLUMNS.map(function(column) {
    return {
      userEnteredValue: {
        stringValue: column.header
      },
      userEnteredFormat: {
        textFormat: {
          bold: true
        }
      }
    }
  });
  return {
    updateCells: {
      start: {
        sheetId: sheetId,
        rowIndex: 0,
        columnIndex: 0
      },
      rows: [
        {
          values: cells
        }
      ],
      fields: 'userEnteredValue,userEnteredFormat.textFormat.bold'
    }
  };
}

SheetsHelper.prototype.sync = function(spreadsheetId, sheetId, orders, callback) {
  var requests = [];
  // Resize the sheet.
  requests.push({
    updateSheetProperties: {
      properties: {
        sheetId: sheetId,
        gridProperties: {
          rowCount: orders.length + 1,
          columnCount: COLUMNS.length
        }
      },
      fields: 'gridProperties(rowCount,columnCount)'
    }
  });
  // Set the cell values.
  requests.push({
    updateCells: {
      start: {
        sheetId: sheetId,
        rowIndex: 1,
        columnIndex: 0
      },
      rows: buildRowsForOrders(orders),
      fields: '*'
    }
  });
  // Send the batchUpdate request.
  var request = {
    spreadsheetId: spreadsheetId,
    resource: {
      requests: requests
    }
  };
  this.service.spreadsheets.batchUpdate(request, function(err) {
    if (err) {
      return callback(err);
    }
    return callback();
  });
};

function buildRowsForOrders(orders) {
  return orders.map(function(order) {
    var cells = COLUMNS.map(function(column) {
      switch (column.field) {
        case 'unitsOrdered':
          return {
            userEnteredValue: {
              numberValue: order.unitsOrdered
            },
            userEnteredFormat: {
              numberFormat: {
                type: 'NUMBER',
                pattern: '#,##0'
              }
            }
          };
          break;
        case 'unitPrice':
          return {
            userEnteredValue: {
              numberValue: order.unitPrice
            },
            userEnteredFormat: {
              numberFormat: {
                type: 'CURRENCY',
                pattern: '"$"#,##0.00'
              }
            }
          };
          break;
        case 'status':
          return {
            userEnteredValue: {
              stringValue: order.status
            },
            dataValidation: {
              condition: {
                type: 'ONE_OF_LIST',
                values: [
                  { userEnteredValue: 'PENDING' },
                  { userEnteredValue: 'SHIPPED' },
                  { userEnteredValue: 'DELIVERED' }
                ]
              },
              strict: true,
              showCustomUi: true
            }
          };
          break;
        default:
          return {
            userEnteredValue: {
              stringValue: order[column.field].toString()
            }
          };
      }
    });
    return {
      values: cells
    };
  });
}


// var pivotSheetId = spreadsheet.sheets[1].properties.sheetId;
// requests = requests.concat([
//   buildPivotTableRequest(dataSheetId, pivotSheetId),
//   buildFormatPivotTableRequest(pivotSheetId),
//   buildAddChartRequest(pivotSheetId)
// ]);
