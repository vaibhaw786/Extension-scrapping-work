/*
File name : microservice.js
Version:1.1.0 (Stable)
Description:  This code Converts English(en) text to Spanish(es) Text
*/

// request Request 
(function(callback) {
    'use strict';

    const httpTransport = require('https');
    const responseEncoding = 'utf8';
    const httpOptions = {
        hostname: 'translation.googleapis.com',
        port: '443',
        path: '/language/translate/v2?key=AIzaSyAksQjL50U_zvOf-GmMr79pvmEIZ3vDq5s',
        method: 'POST',
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        }
    };
    httpOptions.headers['User-Agent'] = 'node ' + process.version;

    // Paw Store Cookies option is not supported
    const server = http.createServer((req, res) => {



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
        request.write("{\"target\":\"es\",\"source\":\"en\",\"format\":\"html\",\"model\":\"nmt\",\"q\":\"My husband, our 1-year-old and I are currently living with my parents so we can pay off our student loans and start saving to purchase a home more quickly. Our only remaining debt is one last student loan, which has a balance of about $5,000. We are $5,000 away from being 100 percent debt-free.\\nNext month, we will have enough money in our emergency fund to pay off the loan. I want to pay it off and just be done with it, and then rebuild our emergency fund afterward. My husband wants to take a couple of extra months so that our emergency fund doesn\\u2019t dip below a certain amount.\\nThoughts?\"}")
        request.end();


    })((error, statusCode, headers, body) => {
        console.log('ERROR:', error);
        console.log('STATUS:', statusCode);
        console.log('HEADERS:', JSON.stringify(headers));
        console.log('BODY:', body);
    });

});

//listen for request on port 3000, and as a callback function have the port listened on logged
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
