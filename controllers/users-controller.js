const { fetchAllUsers, fetchUserByUsername } = require("../models/users-model");

function getAllUsers(request, response, next) {
  return fetchAllUsers()
    .then((allUsers) => {
      response.status(200).send(allUsers);
    })
    .catch((err) => {
      next(err);
    });
}

function getUserByUsername(request, response, next) {
  const username = request.params.username;
  return fetchUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllUsers, getUserByUsername };
