const fs = require('fs');
const csv = require('csv-parser');
const results = [];

console.log("hi");

function run() {
    console.log("Hi");
    fs.createReadStream('test.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log(results);
        });
}

function success(csvData){
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
}

run();
