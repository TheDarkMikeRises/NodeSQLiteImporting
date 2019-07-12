const fs = require('fs');
const csvParser = require('csv-parser');

console.log("hi");

function run() {
    console.log("Hi");
    fs.readFile('fujControls.csv', {
        encoding: 'utf-8'
      }, function(err, csvData) {
        if (err) {
          console.log(err);
        }
        console.log(csvData);
        csvParser(csvData, {
          delimiter: ','
        }, function(err, data) {
            console.log("HIYA");
          if (err) {
            console.log(err);
          } else {
            console.log(data);
          }
        });
    });
}

run();
