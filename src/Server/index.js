const express = require('express');
const morgan = require('morgan');
const pino = require('express-pino-logger');

const ENV = process.env.NODE_ENV || 'dev';

var proxyResolver = require('./Proxy/resolver')

const PORT = process.env.PORT || 9000;

if (ENV === 'production') {
    // code for new relic
}

var app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

// Health check
app.get('/health-check', (req, res) => res.send('Health Check Verified Successfully!'))

app.use('/proxy', proxyResolver)

app.use(pino)

//Logger
app.use(morgan)

var server = app.listen(PORT, function() {
    debugger;
    var host = server.address().host;
    var port = server.address().port;

    console.log(`Face Detection server is running on PORT ${port} with host name as ${host}`)
})


