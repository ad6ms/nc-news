const { fetchAllUsers } = require("../models/users-model");

function getAllUsers(request, response, next) {
  return fetchAllUsers()
    .then((allUsers) => {
      response.status(200).send(allUsers);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { getAllUsers };
