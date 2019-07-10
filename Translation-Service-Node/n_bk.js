/*
File name : microservice.js
Version:1.0.0 
Description:  This code Converts English(en) text to Spanish(es) Text

*/

//Load HTTP module
const http = require("http");
const hostname = '127.0.0.1';
const port = 3036;
var qs = require("querystring");
var url = require("url");

//Create HTTP server and listen on port 3000 for requests
const server = http.createServer((req, res) => {

	//Set the response HTTP header with HTTP status and Content type
	// res.statusCode = 200;
	// res.setHeader('Content-Type', 'text/plain');


	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	var q = url.parse(req.url, true).query;
	var txt = q.content + " " + q.source_lang;
	console.log(txt);



	var api = "AIzaSyAksQjL50U_zvOf-GmMr79pvmEIZ3vDq5s";
	var googleTranslate = require('google-translate')(api);

	var text = (q.content);
	console.log("English :>", text);
	googleTranslate.translate(text, q.target_lang, function(err, translation) {
		res.writeHead(200, {
			'Content-Type': 'text/html'
		});
		console.log("Spanish :>", translation.translatedText);
		res.end(translation.translatedText);
	});
	//res.end("-----hello-----");


});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});
