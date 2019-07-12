console.log("test!");
const readXlsxFile = require('read-excel-file/node');


var jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
//var XMLHttpRequest = require("x")
var $ = jQuery = require('jquery')(window);

const sqlite3 = require('sqlite3').verbose();
// Read JSON file
var json = "sdfsf";
const fs = require('fs');
fs.readFile('./test.json', (err,data) => {
    if(err) throw err;
    json = $.parseJSON(data.toString());
    process(); // Async
    
})
function process() {
   // console.log(json);
   /*
    console.log(json.Threat[1]);
    let db = new sqlite3.Database('./test.db');
    var threats = $.map(json, function(el) {
        var names = [];
        for (let name of el) {
            names.push($.map(name, function(el1) {
                console.log(el1);
                return el1;
            }))
        }

        
        return names});
    */
    var jsonData = {
        ThreatActors: json.Threat_Actor,
        Threats: json.Threat,
        Vulnerabilities: json.Vulnerability,
        Controls: json.Control

    }
    let db = new sqlite3.Database('./test.db');
    
    for (const key in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
            const element = jsonData[key];
            var values = [];
            for (const value of element) {
                values.push($.map(value, (el) => {
                    return el;
                }))
            }
            let placeholders = 7;
            let sql;
            switch (key) {
                case "ThreatActors":
                    placeholders = values.map((values) => '((?),(?))').join(',');
                    console.log(1);
                    sql = `INSERT INTO Threat_Actor(Name, Rating) VALUES ` + placeholders;
                    break;
                case "Threats":
                    placeholders = values.map((values) => '((?),(?),(?))').join(',');
                    console.log(2);
                    sql = `INSERT INTO Threat(Name,Category,yeet) VALUES ` + placeholders;
                    break;
                case "Vulnerabilities":
                    placeholders = values.map((values) => '((?),(?))').join(',');
                    console.log(3);
                    sql = `INSERT INTO Vulnerability(Name, Category) VALUES ` + placeholders;
                    break;
                case "Controls":
                    placeholders = values.map((values) => '((?),(?))').join(',');
                    console.log(4);
                    sql = `INSERT INTO Control(Name, Reference) VALUES ` + placeholders;
                    break;
                default:
                    break;
            }
            console.log(placeholders);
            db.run(sql, extract(values), function(err) {
                console.log(`Rows inserted ${this.changes}`);
                if(err) {
                console.log(key)
                return console.error(err.message);
                }
            }) 
        }
    }
    db.close();
}

function extract(array) {
    var array2 = [];
    for(var i = 0; i < array.length; i++){
    array2 = array2.concat(array[i]);
    }
    console.log(array2);
    return array2;
}

