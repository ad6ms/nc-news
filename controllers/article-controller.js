const { fetchArticleById } = require("../models/article-model");

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

module.exports = getArticleById;
