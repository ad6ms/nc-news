const {
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  patchAlterVotes,
  postNewArticle,
} = require("../models/article-model");

function getArticleById(request, response, next) {
  const id = request.params.article_id;
  const userQuery = request.query;
  return fetchArticleById(id, userQuery)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function getAllArticles(request, response, next) {
  const userQuery = request.query;
  return fetchAllArticles(userQuery)
    .then((articles) => {
      response.status(200).send({ articles, total_count: articles.length });
    })
    .catch((err) => {
      next(err);
    });
}

function getArticleComments(request, response, next) {
  const id = request.params.article_id;
  const userQuery = request.query;
  return fetchArticleComments(id, userQuery)
    .then((comments) => {
      response.status(200).send({ comments, total_count: comments.length });
    })
    .catch((err) => {
      next(err);
    });
}

function alterVotes(request, response, next) {
  const id = request.params.article_id;
  const votes = request.body.inc_votes;
  return patchAlterVotes(votes, id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

function addNewArticle(request, response, next) {
  const newArticle = request.body;

  return postNewArticle(newArticle)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getArticleById,
  getAllArticles,
  getArticleComments,
  alterVotes,
  addNewArticle,
};
