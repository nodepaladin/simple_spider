const http = require('request');
module.exports = {
    'fetchPage':async function (ctx,next) {
        ctx.body = 'fetch page'
    }
}