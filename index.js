const http = require('http');
const fs = require('fs');
let articles = require('./articles');

const hostname = '127.0.0.1';
const port = 3000;

const handlers = {
  '/api/articles/readall' : arReadAll,
  '/api/articles/read' : arRead,
  '/api/articles/create': arCreate,
  '/api/articles/update': arUpdate,
  '/api/articles/delete': arDelete,
  '/api/comments/create': comCreate,
  '/api/comments/delete': comDelete
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
  cb(null, articles);
}

function arRead(req, res, payload, cb) {
  let found;

  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id == payload.id){
      found = articles[i];
      break;
    }
  }

  cb(null, found);
}

function arCreate(req, res, payload, cb) {
  const id = Date.now();
  const result = {id:id, title:payload.title, text:payload.text, date: Date.now(), author: payload.author, comments: []};
  articles.push(result);
  writeJson('./articles.json', JSON.stringify(articles));
  articles = require('./articles.json');

  cb(null, result);
}

function arUpdate(req, res, payload, cb) {
  let found;

  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id == payload.id){
      found = articles[i];

      if (payload.title) found.title = payload.title;
      if (payload.text) found.text = payload.text;
      if (payload.author) found.author = payload.author;

      articles[i] = found;
      break;
    }
  }

  if (found){
    writeJson('./articles.json', JSON.stringify(articles));
    articles = require('./articles.json');
    cb(null, found);
  }else{
    cb(null, {status:-1});
  }
}

function arDelete(req, res, payload, cb) {
  let found;

  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id == payload.id){
      found = articles[i];
      break;
    }
  }

  if (found){
    const index = articles.indexOf(found);
    articles.splice(index, 1);

    writeJson('./articles.json', JSON.stringify(articles));
    articles = require('./articles.json');
    cb(null, found);
  }else{
    cb(null, {status:-1});
  }

}

function comCreate(req, res, payload, cb) {
  const id = Date.now();
  const result = {id: id, articleId: payload.articleId, text:payload.text, date: Date.now(), author: payload.author};
  let found;

  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id == payload.articleId){
      found = articles[i];
      found.comments.push(result);
      articles[i] = found;
      break;
    }
  }

  if (found){
    writeJson('./articles.json', JSON.stringify(articles));
    articles = require('./articles.json');
    cb(null, result);
  }else{
    cb(null, {status:-1});
  }

}

function comDelete(req, res, payload, cb) {
  let foundArticle;

  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id == payload.articleId){
      foundArticle = articles[i];
      break;
    }
  }

  let foundCommentIndex;
  if (foundArticle){
    for (var i = 0; i < foundArticle.comments.length; i++) {
      if (foundArticle.comments[i].id == payload.id){
        foundCommentIndex = foundArticle.comments.indexOf(foundArticle.comments[i]);
        foundArticle.comments.splice(foundCommentIndex, 1);
        break;
      }
    }
  }

  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id == payload.articleId){
      articles[i] = foundArticle;
      break;
    }
  }

  if (foundCommentIndex){
    writeJson('./articles.json', JSON.stringify(articles));
    articles = require('./articles.json');
    cb(null, foundArticle);
  }else{
    cb(null, {status:-1});
  }

}

function writeJson(file, data){
  fs.writeFile(file, data, 'utf8', function (err) {
    if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
    }

    console.log("JSON file has been saved.");
});
}
