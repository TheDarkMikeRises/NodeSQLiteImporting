// Module requirements
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var xlstojson = require('xls-to-json-lc');
var xlsxtojson = require('xlsx-to-json-lc');
var jsdom = require("jsdom");
const {JSDOM} = jsdom;
const {window} = new JSDOM();
//var XMLHttpRequest = require("x")
var $ = jQuery = require('jquery')(window);

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./test.db');

// Parse the posted data
app.use(bodyParser.json());
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        var timeStamp = Date.now();
        cb(null, file.originalname+timeStamp);
    }
});

// File storage settings
var upload = multer({
    storage: storage,
    fileFilter : function(req, file, callback) {
        if(['xls','xlsx', 'json', 'csv', 'xml'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Incorrect file format!'));
        }
        callback(null,true);
    }
}).single('file');


// Upload excel file
var myresult;
app.post('/upload',function(req,res) {
    var exceltojson;
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        // Depending if xlsx or xls...
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            // Setup conversion settings
            exceltojson({
                input: req.file.path,
                output: null,
                lowerCaseHeaders:false
            }, function (err, result) {
                if(err) {
                    console.error(err);
                } else {
                    // Print the converted json
                    //console.log(result);
                    res.json({error_code:0,err_desc:null,data:result});
                    pushToDB(result);
                    return;
                }
            });
        } catch (e) {
            console.error(e);
        }
        //res.json({error_code:0,err_desc:null});
    });
});

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
});
app.listen('3000', function(){
    console.log('');
});



function pushToDB(json) {
    console.log(json);
    var values = [];
    for(const value of json) {
        values.push($.map(value, (el) => {
        return el;
        }))
    }
    var placeholders = values.map((values) => '((?),(?),(?),(?))').join(',');
    var sql = `INSERT INTO Control(Notes, Name, Reference, Category) VALUES ` + placeholders;
    console.log(values);
    db.run(sql, extract(values), function(err) {
        console.log(`Rows inserted ${this.changes}`);
        if(err) {
            console.log(key)
            return console.error(err.message);
        }
    })
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