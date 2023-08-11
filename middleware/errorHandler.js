const { logEvents } = require('./logger');

const errorHandler = (err, req, res, next) => {
    console.log('Error handler middleware:', err);
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500; //server error

    res.status(status);

    res.status(500).json({ error: 'Something went wrong' });

}

module.exports = errorHandler;