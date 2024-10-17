const { postNewComment, deleteComment } = require("../models/comments-model");

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

function removeComment(request, response, next) {
  const comment = request.params.comment_id;

  return deleteComment(comment)
    .then(() => {
      response.status(204).send({ msg: "Succesfully deleted" });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { addNewComment, removeComment };
