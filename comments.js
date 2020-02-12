const fs = require('fs');
const utils = require('./utils.js');
let articles = require('./articles.json');

function comCreate(req, res, payload, cb) {
  const id = Date.now();
  const result = {id: id, articleId: payload.articleId, text:payload.text, date: Date.now(), author: payload.author};
  let found;

  if (!payload.articleId || !payload.text || !payload.author){
    cb(null, { code: 400, message: "Request invalid"});
    return;
  }

  for (var i = 0; i < articles.length; i++) {
    if (articles[i].id == payload.articleId){
      found = articles[i];
      found.comments.push(result);
      articles[i] = found;
      break;
    }
  }

  if (found){
    cb(null, result);
    utils.writeJson('./articles.json', JSON.stringify(articles));
    articles = require('./articles.json');
  }else{
    cb(null, { code: 400, message: "Request invalid"});
  }

}

module.exports.comCreate = comCreate;

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

  if (foundCommentIndex){
    for (var i = 0; i < articles.length; i++) {
      if (articles[i].id == payload.articleId){
        articles[i] = foundArticle;
        break;
      }
    }
  }

  if (foundCommentIndex){
    cb(null, foundArticle);
    utils.writeJson('./articles.json', JSON.stringify(articles));
    articles = require('./articles.json');
  }else{
    cb(null, { code: 400, message: "Request invalid"});
  }

}

module.exports.comDelete = comDelete;
