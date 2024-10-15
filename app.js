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

app.use("/api/articles/:article_id", (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid article ID" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
