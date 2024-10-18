const db = require("../db/connection");
const format = require("pg-format");

function fetchArticleById(id, userQuery) {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments on articles.article_id = comments.article_id
        WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
}

function fetchAllArticles(userQuery) {
  const allowedInputs = [
    "limit",
    "author",
    "titile",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
    "DESC",
    "ASC",
  ];

  const sort_by = userQuery.sort_by ?? "created_at";
  const order = userQuery.order ?? "DESC";
  const limit = userQuery.limit ?? 10;

  if (!allowedInputs.includes(sort_by) || !allowedInputs.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  let queryValues = [];
  let queryString = `SELECT articles.author, articles.title, articles.article_id, 
  articles.topic, articles.created_at, articles.votes, 
  articles.article_img_url, COUNT(comments.article_id) 
  AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (userQuery.topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(userQuery.topic);
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  queryString += ` LIMIT ${limit}`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
}

function fetchArticleComments(id) {
  return fetchArticleById(id)
    .then(() => {
      return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`,
        [id]
      );
    })
    .then((rows) => {
      return { rows, total_count: rows.length };
    });
}

function patchAlterVotes(votes, id) {
  if (typeof votes != "number") {
    return Promise.reject({ status: 400, msg: "Invalid request" });
  }
  return db
    .query(
      `UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2 RETURNING *`,
      [votes, id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows;
    });
}

function postNewArticle(newArticle) {
  const { title, topic, author, body } = newArticle;

  const article_img_url =
    newArticle.article_img_url ?? "https//www.image.com/photo";

  const sql = format(
    `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES (%L) RETURNING article_id;`,
    [title, topic, author, body, article_img_url]
  );

  if (!title || !topic || !author || !body) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  return db
    .query(sql)
    .then(({ rows }) => {
      const newArticleId = rows[0].article_id;
      return fetchArticleById(newArticleId);
    })
    .then((createdArticle) => {
      return createdArticle;
    });
}

module.exports = {
  fetchArticleById,
  fetchAllArticles,
  fetchArticleComments,
  patchAlterVotes,
  postNewArticle,
};
