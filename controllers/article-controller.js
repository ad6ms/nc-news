const {
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
} = require("../models/article-model");

function getArticleById(request, response, next) {
  const id = request.params.article_id;
  return fetchArticleById(id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(request, response, next) {
  return fetchAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleComments(request, response, next) {
  const id = request.params.article_id;
  return fetchArticleComments(id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getArticleById, getAllArticles, getArticleComments };
