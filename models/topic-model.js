const db = require("../db/connection");
const format = require("pg-format");

function fetchTopics() {
  return db.query(`SELECT * FROM topics`).then((data) => {
    return data.rows;
  });
}

function postNewTopic(newTopic) {
  const { slug, description } = newTopic;
  const sql = format(
    `INSERT INTO topics (slug, description) VALUES (%L) RETURNING *`,
    [slug, description]
  );

  if (
    typeof slug !== "string" ||
    typeof description !== "string" ||
    !slug ||
    !description
  ) {
    return Promise.reject({ status: 400, msg: "Invalid topic" });
  }

  return db.query(sql).then(({ rows }) => {
    return rows[0];
  });
}

module.exports = { fetchTopics, postNewTopic };
