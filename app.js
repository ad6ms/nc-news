const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const getTopics = require("./controllers/topic-controller");
const {
  getArticleById,
  getAllArticles,
  getArticleComments,
  alterVotes,
} = require("./controllers/article-controller");
const { addNewComment } = require("./controllers/comments-controller");

app.use(express.json());

app.get("/api", (request, response) => {
  return response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", addNewComment);

app.patch("/api/articles/:article_id", alterVotes);

app.use("/api/articles/:article_id", (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid article ID" });
  }
  next(err);
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
