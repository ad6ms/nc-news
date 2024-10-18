const db = require("../db/connection");
const format = require("pg-format");

function postNewComment(newComment, id) {
  const { body, username } = newComment;
  const sql = format(
    `INSERT INTO comments (body, article_id, author) VALUES (%L) RETURNING *`,
    [body, id, username]
  );

  if (!body || !username) {
    return Promise.reject({ status: 400, msg: "Invalid comment" });
  }
  return db.query(sql).then(({ rows }) => {
    return rows[0];
  });
}

function deleteComment(comment) {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [comment])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
}

function changeCommentVotes(newVote, commentId) {
  if (typeof newVote !== "number") {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [newVote, commentId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows;
    });
}

module.exports = { postNewComment, deleteComment, changeCommentVotes };
