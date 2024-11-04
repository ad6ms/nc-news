const express = require("express");
const app = express();
const cors = require("cors");
const endpoints = require("./endpoints.json");
const { getTopics, addNewTopic } = require("./controllers/topic-controller");
const {
  getArticleById,
  getAllArticles,
  getArticleComments,
  alterVotes,
  addNewArticle,
  deleteArticle,
} = require("./controllers/article-controller");

const {
  addNewComment,
  removeComment,
  alterCommentVotes,
} = require("./controllers/comments-controller");

const {
  getAllUsers,
  getUserByUsername,
} = require("./controllers/users-controller");

app.use(cors());

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

app.delete("/api/comments/:comment_id", removeComment);

app.get("/api/users", getAllUsers);

app.get("/api/users/:username", getUserByUsername);

app.patch("/api/comments/:comment_id", alterCommentVotes);

app.post("/api/articles", addNewArticle);

app.post("/api/topics", addNewTopic);

app.delete("/api/articles/:article_id", deleteArticle);

app.use("/api/articles/:article_id", (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ msg: "Invalid article ID" });
  }
  next(err);
});

app.use("/api/articles", (err, request, response, next) => {
  if (err.code === "42703") {
    response.status(400).send({ msg: "Invalid limit" });
  }
  next(err);
});

app.use((err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
