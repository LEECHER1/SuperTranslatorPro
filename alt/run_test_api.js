const https = require('https');

const data = new URLSearchParams({
    language: 'de-DE',
    level: 'picky',
    text: 'Ich bin hier. The weather is nice today, but heier is bad.'
}).toString();

const options = {
    hostname: 'api.languagetool.org',
    path: '/v2/check',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': data.length
    }
};

const req = https.request(options, res => {
    let responseData = '';

    res.on('data', chunk => {
        responseData += chunk;
    });

    res.on('end', () => {
        console.log("Response:", responseData);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
