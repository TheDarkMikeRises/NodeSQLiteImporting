const fs = require('fs');
const csv = require('csv-parser');
const sqlite = require('sqlite3');
const readline = require('readline');
var http = require('http');
const results = [];

function run(filePath) {
    //Establish database connection
    let db = new sqlite.Database('test.db');
    let sql = 'INSERT INTO Control(Name, Category, Reference, Date_Created, Date_Reviewed, Notes) VALUES ((?),(?),(?),(?),(?),(?))';

    //Open the csv file
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            //Insert data into database row by row
            for (const row of results) {
                db.run(sql, Object.values(row), function(err){
                    if(err) return console.error(err.message);
                    console.log(`Rows inserted ${this.changes}`);
                })
                console.log(row);
            }
        });
}


function consoleInterface(){
    //Create console interface
    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    r1.question('Enter the filepath of your csv file:\n', (answer) => {
        //Run filestore
        run(answer);
        r1.close();
    });
}
module.exports = {
    insertContorl : run(),
    consoleInterface : consoleInterface()
}
