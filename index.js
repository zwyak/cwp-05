const http = require('http');
const fs = require('fs');
const articles = require('./articles');

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
  '/api/articles/readall' : arReadAll,
  '/api/articles/read' : arRead
  //'/api/articles/create': arCreate,
  //'/api/articles/update': arUpdate,
  //'/api/articles/delete': arDelete,
  //'/api/comments/create': comCreate,
  //'/api/comments/delete': comDelete
};

const server = http.createServer((req, res) => {
  parseBodyJson(req, (err, payload) => {
    const handler = getHandler(req.url);

    handler(req, res, payload, (err, result) => {
      if (err) {
        res.statusCode = err.code;
        res.setHeader('Content-Type', 'application/json');
        res.end( JSON.stringify(err) );

        return;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end( JSON.stringify(result) );
    });
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function getHandler(url) {
  return handlers[url] || notFound;
}

function notFound(req, res, payload, cb) {
  cb({ code: 404, message: 'Not found'});
}

function parseBodyJson(req, cb) {
  let body = [];

  req.on('data', function(chunk) {
    body.push(chunk);
  }).on('end', function() {
    body = Buffer.concat(body).toString();

    let params = JSON.parse(body);

    cb(null, params);
  });
}

function arReadAll(req, res, payload, cb) {
  const result = articles;
  cb(null, result);
}

function arRead(req, res, payload, cb) {
  let found = articles.find( (element)=> {
    return element.id = payload.id;
  });

  cb(null, found);
}

function arCreate(req, res, payload, cb) {
  articles.push(payload);
  
  cb(null, result);
}
