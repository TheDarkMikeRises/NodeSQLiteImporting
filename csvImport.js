const fs = require('fs');
const csv = require('csv-parser');
const sqlite = require('sqlite3');
const results = [];

console.log("hi");

function run() {
    let db = new sqlite.Database('./test.db');
    let sql = 'INSERT INTO Control(Name, Category, Reference, Date_Created, Date_Reviewed) VALUES ((?),(?))';
    console.log("Hi");
    fs.createReadStream('test.csv')
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

function insertData(data){ 
    
}

run();
