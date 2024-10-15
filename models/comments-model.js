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

module.exports = { postNewComment };
