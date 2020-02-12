const fs = require('fs');
const utils = require('./utils.js');
let articles = require('./articles.json');

function arReadAll(req, res, payload, cb) {
  cb(null, articles);
}

module.exports.arReadAll = arReadAll

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

module.exports.arRead = arRead

function arCreate(req, res, payload, cb) {
  const id = Date.now();
  const result = {id:id, title:payload.title, text:payload.text, date: Date.now(), author: payload.author, comments: []};

  if (!payload.title || !payload.text || !payload.author){
    cb(null, { code: 400, message: "Request invalid"});
    return;
  }

  articles.push(result);

  cb(null, result);

  utils.writeJson('./articles.json', JSON.stringify(articles));
  articles = require('./articles.json');

}

module.exports.arCreate = arCreate

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
    cb(null, found);
    utils.writeJson('./articles.json', JSON.stringify(articles));
    articles = require('./articles.json');
  }else{
    cb(null, { code: 400, message: "Request invalid"});
  }
}

module.exports.arUpdate = arUpdate

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

    cb(null, found);
    utils.writeJson('./articles.json', JSON.stringify(articles));
    articles = require('./articles.json');
  }else{
    cb(null, { code: 400, message: "Request invalid"});
  }

}

module.exports.arDelete = arDelete
