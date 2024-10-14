const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topic-controller");
const {
  getArticleById,
  getAllArticles,
} = require("./controllers/article-controller");

app.get("/api", (request, response) => {
  return response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

module.exports = app;
