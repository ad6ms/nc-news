const { postNewComment } = require("../models/comments-model");

function addNewComment(request, response, next) {
  const newComment = request.body;
  const id = request.params.article_id;

  return postNewComment(newComment, id)
    .then((newComment) => {
      response.status(201).send({
        newComment,
      });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { addNewComment };
