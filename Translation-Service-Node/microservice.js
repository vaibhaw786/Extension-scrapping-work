/*
File name : microservice.js
Version:1.1.1 (Stable)
Description:  This code Converts English(en) text to Spanish(es) Text supports only POST method .
Install Module: Multiparty
*/

'use strict';
const http = require("http");
var multiparty = require('multiparty');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/"; // Database connection to mongodb
var util = require('util');
var qs = require("querystring"); // for geting POST Data
const hostname = '127.0.0.1'; // your host name default host name (127.0.0.1)
const port = 3036; // port you want to publish your API
const httpTransport = require('https');
const responseEncoding = 'utf8';
const db_name = "ofertabandido"; // add your database name here 
const table_name = "googlet1"; // add your table name here where you want to save data
var httpOptions = {
    hostname: 'translation.googleapis.com',
    port: '443',
    path: '',
    method: 'POST',
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    }
}; ///language/translate/v2?key=AIzaSyAksQjL50U_zvOf-GmMr79pvmEIZ3vDq5s
httpOptions.headers['User-Agent'] = 'node ' + process.version;

// this code add slashes '/"/"'
function addslashes(string) {
    return string.replace(/\\/g, '\\\\').
    replace(/\u0008/g, '\\b').
    replace(/\t/g, '\\t').
    replace(/\n/g, '\\n').
    replace(/\f/g, '\\f').
    replace(/\r/g, '\\r').
    replace(/'/g, '\\\'').
    replace(/"/g, '\\"');
}


// Paw Store Cookies option is not supported
//this starts server 
const server = http.createServer((req, res) => {

    if (req.url === '/' && req.method === 'POST') {
        // parse a file upload
        var form = new multiparty.Form();
        // creating form for submission by post method 
        form.parse(req, function(err, fields, files) {
            res.writeHead(200, {
                'content-type': 'text/plain'
            });
            httpOptions.path = '/language/translate/v2?key=' + fields.key[0];
            fields.content[0] = addslashes(fields.content[0]);
            (function(callback) {
                const request = httpTransport.request(httpOptions, (res) => {
                        let responseBufs = [];
                        let responseStr = '';

                        res.on('data', (chunk) => {
                            if (Buffer.isBuffer(chunk)) {
                                responseBufs.push(chunk);
                            } else {
                                responseStr = responseStr + chunk;
                            }
                        }).on('end', () => {
                            responseStr = responseBufs.length > 0 ?
                                Buffer.concat(responseBufs).toString(responseEncoding) : responseStr;



                            callback(null, res.statusCode, res.headers, responseStr);
                        });

                    })
                    .setTimeout(0)
                    .on('error', (error) => {
                        callback(error);
                    });

                request.write("{\"target\":\"es\",\"source\":\"en\",\"format\":\"html\",\"model\":\"nmt\",\"q\":\"" + fields.content[0] + "\"}")
                request.end();


            })((error, statusCode, headers, body) => {
                var x = JSON.parse(body);
                console.log(x.data, body);
                x = x.data.translations;
                res.end(JSON.stringify({
                    translatedtext: x[0].translatedText,
                    target: fields.target_lang[0],
                    source: fields.source_lang[0],
                    model: x[0].model
                }));

                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db(db_name);
                    var myobj = {
                        "target": fields.target_lang[0],
                        "source": fields.source_lang[0],
                        "format": "html",
                        "model": x[0].model,
                        "q": fields.content[0],
                        "o": x[0].translatedText
                    };
                    dbo.collection(table_name).insertOne(myobj, function(err, res) {
                        if (err) throw err;
                        console.log("1 document inserted");
                        db.close();
                    });
                });



            });

        });
        return;
    }
});



//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
