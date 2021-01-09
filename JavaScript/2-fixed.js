'use strict';

// Use curl after run this file:
// curl -v http://127.0.0.1:8000/%2e%2e/1-traversal.js

const fs = require('fs');
const http = require('http');
const path = require('path');

const STATIC_PATH = path.join(process.cwd(), './static');

const MIME_TYPES = {
    html: 'text/html; charset = utf8-',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    png: 'image/png',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};

const serveFile = name => {
    const filePath = path.join(STATIC_PATH, name);
    if (!filePath.startsWith(STATIC_PATH)) {
        console.log(`Access denied: ${name}`);
        return null;
    }
    console.log(`Serve: ${name} from ${filePath}`);
    const stream = fs.createReadStream(filePath);
    return stream;
};

http.createServer((req, res) => {
    const url = decodeURI(req.url);
    const name = url === '/' ? 'index.html' : url;
    const fileExt = path.extname(name).substring(1);
    const mimeType = MIME_TYPES[fileExt] || MIME_TYPES.html;
    res.writeHead(200, { 'Content-Type': mimeType });
    const stream = serveFile(name);
    if (!stream) {
        res.end();
        return;
    }
    stream.pipe(res);
    stream.on('error', error => {
        console.log(error.message);
        res.end();
    });
}).listen(8000);