const express = require("express");
const request = require("express");
const fetchTopics = require("../models/topic-model");

function getTopics(request, response, next) {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      console.log(err, "ERROR IN THE CONTROLLER");
      next(err);
    });
}

module.exports = getTopics;
