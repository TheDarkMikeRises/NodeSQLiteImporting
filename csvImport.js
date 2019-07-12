var express = require('express');
const app = express();
var multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const sqlite = require('sqlite3');
const readline = require('readline');
const results = [];

console.log("hi");

function run(filePath) {
    let db = new sqlite.Database('test.db');
    let sql = 'INSERT INTO Control(Name, Category, Reference, Date_Created, Date_Reviewed) VALUES ((?),(?),(?),(?),(?))';
    console.log("Hi");
    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            for (const record of results) {
                db.run(sql, Object.values(record), function(err){
                    if(err) return console.error(err.message);
                    console.log(`Rows inserted ${this.changes}`);
                })
                console.log(record);
            }
        });
}

const r1 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
r1.question('Enter the filepath of your csv file:\n', (answer) => {
    run(answer);
    r1.close();
});
