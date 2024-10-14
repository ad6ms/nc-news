const express = require("express");
const app = express();
const getTopics = require("./controllers/topic-controller");
const endpoints = require("./endpoints.json");

app.get("/api", (request, response) => {
  return response.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

module.exports = app;
