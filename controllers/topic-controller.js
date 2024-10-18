const { fetchTopics, postNewTopic } = require("../models/topic-model");

function getTopics(request, response, next) {
  fetchTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
}

function addNewTopic(request, response, next) {
  const newTopic = request.body;

  return postNewTopic(newTopic)
    .then((createdTopic) => {
      response.status(201).send({ createdTopic });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getTopics, addNewTopic };
